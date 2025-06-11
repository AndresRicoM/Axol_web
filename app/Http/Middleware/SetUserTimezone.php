<?php

namespace App\Http\Middleware;

use Closure;
use GuzzleHttp\Client;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetUserTimezone
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle($request, Closure $next)
    {
        $response = $next($request);

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

            // Adjuntar la cookie directamente a la respuesta
            $response->headers->setCookie(cookie('timezone', $timezone, 60 * 24 * 30, '/', null, false, false));
        }

        return $response;
    }
}
