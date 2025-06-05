<?php

namespace App\Http\Middleware;

use Closure;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Cookie;

class SetUserTimezone
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): \Symfony\Component\HttpFoundation\Response  $next
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle($request, Closure $next)
    {
        // Si no hay cookie, consulta la API y crea la cookie
        if (!$request->hasCookie('timezone')) {
            $ip = $request->ip();

            // Para desarrollo local, usa IP pública fija
            if ($ip === '127.0.0.1' || $ip === '::1') {
                $ip = '189.163.154.202'; // Cambia por tu IP pública si quieres
            }

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

            // Encolar la cookie para que se agregue en la respuesta
            Cookie::queue(cookie('timezone', $timezone, 60 * 24 * 30)); // 30 días

            // Aplicar la zona horaria para esta petición
            date_default_timezone_set($timezone);
        } else {
            // Si la cookie existe, solo aplica la zona horaria
            $timezone = $request->cookie('timezone', config('app.timezone'));
            if (in_array($timezone, timezone_identifiers_list())) {
                date_default_timezone_set($timezone);
            } else {
                date_default_timezone_set(config('app.timezone'));
            }
        }

        // Continuar con la petición y devolver la respuesta
        return $next($request);
    }
}
