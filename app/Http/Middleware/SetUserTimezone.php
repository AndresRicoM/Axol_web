<?php

namespace App\Http\Middleware;

use Closure;
use GuzzleHttp\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;
use Symfony\Component\HttpFoundation\Response;

class SetUserTimezone
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle($request, Closure $next)
    {
        if (!$request->hasCookie('timezone')) {
            $ip = $request->ip();
            
            $client = new Client(['verify' => false]);
            $apiKey = config('services.ipgeolocation.api_key');

            $apiResponse = $client->get('https://api.ipgeolocation.io/v2/timezone', [
                'query' => [
                    'apiKey' => $apiKey,
                    'ip' => $ip,
                ],
            ]);

            $data = json_decode($apiResponse->getBody(), true);
            $timezone = $data['time_zone']['name'] ?? config('app.timezone');

            // Solo encolar la cookie para que se agregue en la respuesta
            Cookie::queue(cookie('timezone', $timezone, 60 * 24 * 30)); // 30 días
        }

        return $next($request);
    }
}
