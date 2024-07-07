showListOrder = () => {
    const latitude = localStorage.getItem('latitude')
    const longitude = localStorage.getItem('longitude')

    $.ajax({
        url: "https://gravery-api.vercel.app/api/list-order",
        method: "POST",
        data: {
            lat: latitude,
            long: longitude
        },
        success: function (result) {
            let temp = ''

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

            $('#list-order').html(temp);
        },
        error: function () {
            app.dialog.alert("Tidak Terhubung dengan Server!", "Error");
        }
    })
}

showOngoing = () => {
    $.ajax({
        url: "https://gravery-api.vercel.app/api/list-order",
        method: "GET",
        success: function (result) {
            console.log(result);

            let temp = ''

            result.data.forEach((d) => {
                if (d.is_picked_up && !d.is_finished) {
                    temp += `<div class="card">
                                <div class="card-content card-content-padding">
                                    <h2 class="col" style="font-weight: bold;">${d.customer.name}</h2>
                                    <p>Total: ${rupiahFormatter(d.total)}</p>
                                    <div class="left">
                                        <button class="button button-small button-tonal" onclick="detailOngoing(${d.customer_id})">Selesaikan Pesanan</button>
                                    </div>
                                </div>
                            </div>`
                }
            })

            $('#ongoing-list-order').html(temp);
        },
        error: function () {
            app.dialog.alert("Tidak Terhubung dengan Server!", "Error");
        }
    })
}

detailPickup = (id) => {
    app.views.main.router.navigate(`/detail-pickup/${id}`);
}

makePickUp = (orderID) => {
    let courierId = sessionStorage.getItem("courierId");

    $.ajax({
        url: `https://gravery-api.vercel.app/api/pickup-order/${orderID}`,
        method: "POST",
        data: {
            courier_id: courierId,
        },
        success: function (result) {
            let message = result.message;
            app.dialog.alert(message, "Info")
        },
        error: function () {
            app.dialog.alert("Tidak Terhubung dengan Server!", "Error");
        }
    })
}

detailOngoing = (id) => {
    app.views.main.router.navigate(`/detail-ongoing/${id}`);
}

finishPickup = (id) => {
    let courierId = sessionStorage.getItem("courierId");
    $.ajax({
        url: `https://gravery-api.vercel.app/api/finish/pickup-order/${id}`,
        method: "POST",
        data: {
            courier_id: courierId,
        },
        success: function (result) {
            let message = result.message;
            console.log(result);
            app.dialog.alert(message, "Info")
        },
        error: function () {
            app.dialog.alert("Tidak Terhubung dengan Server!", "Error");
        }
    })
}