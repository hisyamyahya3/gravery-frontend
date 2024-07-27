function getLocation() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
            },
            (error) => {
                console.error('Error code:', error.code, 'Error message:', error.message)
            },
            {
                timeout: 10000,
                enableHighAccuracy: true
            }
        );
    })
}