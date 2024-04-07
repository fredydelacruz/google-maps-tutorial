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
                version: 'quartely',
            });

            const { Map } = await loader.importLibrary('maps');

            // Obtener la ubicación actual del usuario
            navigator.geolocation.getCurrentPosition(async (position) => {
                const locationInMap = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };

                // Convertir las coordenadas a string y guardarlas en el estado
                setLocationString(JSON.stringify(locationInMap));

                // MARKER
                const { Marker } = (await loader.importLibrary(
                    'marker'
                )) as google.maps.MarkerLibrary;

                const options: google.maps.MapOptions = {
                    center: locationInMap,
                    zoom: 15,
                    mapId: 'NEXT_MAPS_TUTS',
                };

                const map = new Map(mapRef.current as HTMLDivElement, options);

                // add the marker in the map
                const marker = new Marker({
                    map: map,
                    position: locationInMap,
                });
            });
        };

        initializeMap();
    }, []);

    return (
        <div>
            <div className="h-[600px]" ref={mapRef} />
            <p>Ubicación actual: {locationString}</p>
        </div>
    );
}