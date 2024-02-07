// ChargingStationSearchMap.js
import React, { useEffect, useMemo, useRef, useState } from "react";

const ChargingStationSearchMap = () => {
    const mapRef = useRef(null);
    let map; // ���� ��ü�� ���� ����
    const [mapCenter, setMapCenter] = useState({
        lat: 36.39213160000001,
        lng: 127.02977109999999,
    });

    const initMap = () => {
        const container = document.getElementById("map");
        const options = {
            center: new window.kakao.maps.LatLng(mapCenter.lat, mapCenter.lng),
            level: 3,
        };

        map = new window.kakao.maps.Map(container, options);
    };

    useMemo(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(success, error);
        }

        function success(position) {
            setMapCenter({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            });
        }

        function error() {
            setMapCenter({
                lat: 36.483034,
                lng: 126.902435,
            });
            console.log("��ġ �ޱ� ����");
        }
    }, []);

    useEffect(() => {
        window.kakao.maps.load(() => initMap());
    }, []);

    const handleAdjustPosition = () => {
        initMap(); // �Լ��� ȣ���ϵ��� ����
    };

    return (
        <div>
            <div
                id="map"
                style={{
                    marginTop: "20px",
                    width: "70%",
                    height: "calc(100vh - 165px)",
                    border: "1px solid #ccc",
                    overflow: "hidden",
                }}
                ref={mapRef}
            />
            <button
                style={{ position: "relative", zIndex: "2" }}
                onClick={handleAdjustPosition} // �Լ��� ȣ���ϵ��� ����
            >
                ��ġ ����
            </button>
        </div>
    );
};

export default ChargingStationSearchMap;
