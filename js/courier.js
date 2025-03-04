// function getLocation() {
//     return new Promise((resolve, reject) => {
//         navigator.geolocation.getCurrentPosition(
//             (position) => {
//                 resolve({
//                     latitude: position.coords.latitude,
//                     longitude: position.coords.longitude
//                 });
//             },
//             (error) => {
//                 console.error('Error code:', error.code, 'Error message:', error.message)
//             },
//             {
//                 timeout: 10000,
//                 enableHighAccuracy: true
//             }
//         );
//     })
// }

showListOrder = async () => {
    // const latitude = localStorage.getItem('latitude')
    // const longitude = localStorage.getItem('longitude')

    const position = await getLocation()

    $.ajax({
        url: "https://gravery-api.vercel.app/api/list-order",
        method: "POST",
        data: {
            lat: position.latitude,
            long: position.longitude
        },
        success: function (result) {
            let temp = ''

            if (result.data == null) {
                return $('.pickup-content-wrapper').html(`
                    <div class="card">
                        <div class="card-content card-content-padding">
                            <h2>${result.message}</h2>
                        </div>
                    </div>
                `)
            }

            result.data.forEach((d) => {
                if (!d.is_picked_up) {
                    temp += `<div class="card">
                                <div class="card-content card-content-padding">
                                    <h2 class="col" style="font-weight: bold;">${d.customer_name}</h2>
                                    <p>Total: ${rupiahFormatter(d.total)}</p>
                                    <p>Berat (Dalam Kg): ${d.total_weight}</p>
                                    <p>Jarak: ${d.distance} Km</p>
                                    <div class="left">
                                        <button class="button button-small button-tonal" onclick="detailPickup(${d.id})">Jemput</button>
                                    </div>
                                </div>
                            </div>`
                }
            })

            $('.pickup-content').removeClass('display-none');
            $('#list-order').html(temp);
        },
        error: function () {
            app.dialog.alert("Tidak Terhubung dengan Server!", "Error");
        }
    })
}

showOngoing = () => {
    const courierId = sessionStorage.getItem("courierId");

    $.ajax({
        url: "https://gravery-api.vercel.app/api/ongoing-order",
        method: "POST",
        data: { courier_id: courierId },
        success: function (result) {
            const data = result.data

            if (data == null) {
                return $('.ongoing-content-wrapper').html(`
                    <div class="card">
                        <div class="card-content card-content-padding">
                            <h2>${result.message}</h2>
                        </div>
                    </div>
                `)
            }

            let orderTemplate = ''
            let detailOrderTemplate = ''

            data.forEach((d) => {
                orderTemplate += `
                    <div class="card">
                        <div class="card-content card-content-padding">
                            <p>Nama Pelanggan: ${d.customer_name}</p>
                            <p>Alamat Pelanggan: ${d.customer_address}</p>
                            <p>Total: ${rupiahFormatter(d.total)}</p>
                            <p>Tanggal Order: ${d.parsedOrderDate}</p>
                            <div class="left">
                                <button class="button button-small button-tonal" onclick="finishPickup(${d.id})">Selesaikan Pesanan</button>
                            </div><br>
                            <a href="#" class="button button-small button-tonal" role="button" onclick="showOnMaps()">Lihat di Peta</a>
                        </div>
                    </div>
                `

                d.orderItems.forEach((orderItems) => {
                    detailOrderTemplate += `<div class="card">
                                <div class="card-content card-content-padding">
                                    <h2 class="col" style="font-weight: bold;">Jenis Sampah: ${(orderItems.garbage_id == 1) ? 'Organic' : 'Anorganic'}</h2>
                                    <p>Berat (Dalam Kg): ${orderItems.weight}</p>
                                    <p>Harga: ${rupiahFormatter(orderItems.price)}</p>
                                </div>
                            </div>`
                })
            })

            localStorage.setItem('custLat', result.data[0].customer_lat)
            localStorage.setItem('custLong', result.data[0].customer_long)

            // map
            const courierLat = localStorage.getItem('latitude')
            const courierLong = localStorage.getItem('longitude')
            const custLat = result.data[0].customer_lat
            const custLong = result.data[0].customer_long

            let map = L.map('map').setView([courierLat, courierLong], 18);

            // Add OpenStreetMap tile layer
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            // Marker for the user's location
            let marker = L.marker([courierLat, courierLong]).addTo(map);
            marker.bindTooltip('Posisi kamu', { permanent: true }).openTooltip()
            let customerMarker = L.marker([custLat, custLong]).addTo(map);
            customerMarker.bindTooltip('Posisi customer', { permanent: true }).openTooltip()

            // Watch user's location and update the marker
            navigator.geolocation.watchPosition(function (position) {
                let lat = position.coords.latitude;
                let lon = position.coords.longitude;
                let accuracy = position.coords.accuracy;

                // Update the marker position
                marker.setLatLng([lat, lon]);

                // Center the map on the new position
                map.setView([lat, lon]);

                // Optionally, add a circle to show the accuracy of the location
                let circle = L.circle([lat, lon], {
                    radius: accuracy
                }).addTo(map);
            }, function (error) {
                console.error("Error watching position: ", error);
            }, {
                enableHighAccuracy: true,
                maximumAge: 0,
                timeout: 60000
            });
            // end of map

            $('.ongoing-content').removeClass('display-none')
            $('#ongoing-list-order').html(orderTemplate);
            $('#pickup-detail-orderitems').html(detailOrderTemplate)
        },
        error: function () {
            app.dialog.alert("Tidak Terhubung dengan Server!", "Error");
        }
    })
}

detailPickup = (id) => {
    app.views.main.router.navigate(`/detail-pickup/${id}`);
}

makePickUp = async (orderID) => {
    const courierId = sessionStorage.getItem("courierId")
    // const courierLat = localStorage.getItem('latitude')
    // const courierLong = localStorage.getItem('longitude')
    const position = await getLocation()
    const courierLat = position.latitude
    const courierLong = position.longitude
    const custLat = localStorage.getItem('custLat')
    const custLong = localStorage.getItem('custLong')

    app.dialog.confirm('Apa kamu yakin ingin mengambil pesanan ini?', 'Info', () => {
        $.ajax({
            url: `https://gravery-api.vercel.app/api/pickup-order/${orderID}`,
            method: "POST",
            data: {
                courier_id: courierId,
            },
            success: function (result) {
                let message = result.message
                app.dialog.alert(message, "Info")

                if (result.status == 'ok') {
                    return window.open(`https://www.google.com/maps/dir/?api=1&origin=${courierLat},${courierLong}&destination=${custLat},${custLong}`)
                }
            },
            error: function () {
                app.dialog.alert("Tidak Terhubung dengan Server!", "Error");
            }
        })
    })
}

detailOngoing = (id) => {
    app.views.main.router.navigate(`/detail-ongoing/${id}`);
}

finishPickup = async (orderID) => {
    const courierId = sessionStorage.getItem("courierId")
    // const latitude = localStorage.getItem('latitude')
    // const longitude = localStorage.getItem('longitude')
    const position = await getLocation()
    const courierLat = position.latitude
    const courierLong = position.longitude

    app.dialog.confirm('Apa kamu yakin ingin menyelesaikan pesanan ini?', 'Info', () => {
        $.ajax({
            url: `https://gravery-api.vercel.app/api/finish/pickup-order/${orderID}`,
            method: "POST",
            data: {
                lat: courierLat,
                long: courierLong,
                courier_id: courierId,
            },
            success: function (result) {
                app.dialog.alert(result.message, "Info")

                if (result.status == 'ok') {
                    return app.views.main.router.refreshPage()
                }
            },
            error: function () {
                app.dialog.alert("Tidak Terhubung dengan Server!", "Error");
            }
        })
    })
}

historyPickup = () => {
    const courierId = sessionStorage.getItem("courierId")

    $.ajax({
        url: "https://gravery-api.vercel.app/api/pickup/history",
        method: "POST",
        data: { courier_id: courierId },
        success: function (result) {
            const data = result.data

            if (data == null) {
                return $('#history-content').html(`
                    <div class="card">
                        <div class="card-content card-content-padding">
                            <h2>${result.message}</h2>
                        </div>
                    </div>
                `)
            }

            let template = ''

            data.forEach((d) => {
                template += `
                    <div class="card">
                        <div class="card-content card-content-padding">
                            <p>Nama Pelanggan : ${d.customer_name}</p>
                            <p>Tgl Dijemput : ${d.parsedPickedAt}</p>
                            <p>Berat (Dalam Kg): ${d.total_weight}</p>
                            <p>Total: ${rupiahFormatter(d.total)}</p>
                            <p>Nama Kurir : ${d.courier_name}</p>
                        </div>
                    </div>`
            })

            $('#history-content').html(template);
        },
        error: function () {
            app.dialog.alert("Tidak Terhubung dengan Server!", "Error");
        }
    })
}

showOnMaps = async () => {
    // const courierLat = localStorage.getItem('latitude')
    // const courierLong = localStorage.getItem('longitude')
    const position = await getLocation()
    const courierLat = position.latitude
    const courierLong = position.longitude
    const custLat = localStorage.getItem('custLat')
    const custLong = localStorage.getItem('custLong')

    return window.open(`https://www.google.com/maps/dir/?api=1&origin=${courierLat},${courierLong}&destination=${custLat},${custLong}`)
}