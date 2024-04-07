'use client';

import React, { useEffect, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

export default function GoogleMaps() {
    const mapRef = React.useRef<HTMLDivElement>(null);
    const [locationString, setLocationString] = useState<string>('');

    useEffect(() => {
        const initializeMap = async () => {
            const loader = new Loader({
                apiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
                version: 'quarterly',
            });

            const { Map } = await loader.importLibrary('maps');

            // Obtener la ubicación actual del usuario
            if (typeof window !== 'undefined') {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        const locationInMap = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                        };

                        // Convertir las coordenadas a string y guardarlas en el estado
                        setLocationString(`${position.coords.latitude}, ${position.coords.longitude}`);

                        // MARKER
                        // Aquí deberías usar google.maps.marker.AdvancedMarkerElement en lugar de google.maps.Marker
                        // Pero como AdvancedMarkerElement no está disponible en la biblioteca de tipos @types/googlemaps,
                        // seguiré usando google.maps.Marker aquí. Deberías considerar migrar a AdvancedMarkerElement cuando esté disponible.
                        const { Marker } = (await loader.importLibrary(
                            'marker'
                        )) as google.maps.MarkerLibrary;

                        const options: google.maps.MapOptions = {
                            center: locationInMap,
                            zoom: 15,
                            mapId: 'NEXT_MAPS_TUTS',
                            mapTypeControl: false, // Desactiva el control de tipo de mapa (Satélite/Mapa)
                            streetViewControl: false, // Desactiva el control de Street View
                            fullscreenControl: false, // Desactiva el control de pantalla completa
                        };

                        const map = new Map(mapRef.current as HTMLDivElement, options);

                        // add the marker in the map
                        const marker = new Marker({
                            map: map,
                            position: locationInMap,
                            draggable: true, // Permite que el marcador sea movible
                        });
                    },
                    (error) => {
                        console.error("Error obteniendo la ubicación", error);
                        // Aquí puedes manejar el error como mejor te parezca, por ejemplo mostrando un mensaje al usuario.
                    },
                    {
                        timeout: 5000, // Tiempo de espera antes de que la solicitud de ubicación falle
                    }
                );
            }
        };

        initializeMap();
    }, []);

    return (
        <div>
            <div className="h-[300px] w-[300px]" ref={mapRef} />
        </div>
    );
}