$(document).ready(function () {
    // ------------------ Handle Datatable ------------------
    function renderProduct() {
        $.ajax({
            url: "/api/invoice/",
            method: "GET",
            async: false,
            success: function (data) {
                console.log("success: ", data.length);
                // console.log(data);
                table.rows.add(data).draw();
            },
            error: function (err) {
                console.log(err.responseText);
            },
        });
    }

    const data = [];
    const userRole = $("#currentUser").data("role");
    const table = $("#invoices-datatable").DataTable({
        keys: true,
        responsive: true,
        language: {
            paginate: {
                previous: "<i class='mdi mdi-chevron-left'>",
                next: "<i class='mdi mdi-chevron-right'>",
            },
            info: "Showing customers _START_ to _END_ of _TOTAL_",
            lengthMenu:
                'Display <select class=\'custom-select custom-select-sm ml-1 mr-1\'><option value="10">10</option><option value="20">20</option><option value="-1">All</option></select> invoices',
        },
        pageLength: 10,
        rowId: "_id",
        select: {style: "multi"},
        order: [[1, "asc"]],
        drawCallback: function () {
            $(".dataTables_paginate > .pagination").addClass("pagination-rounded");
        },
        columns: [
            {
                data: "_id",
                render: function (data, type, row) {
                    return `<span class="font-weight-bold">${data}</span>`
                },
            },
            {
                data: "createdAt",
                render: function (data, type, row) {
                    return new Date(data).toLocaleString();
                },
            },
            {
                data: "account",
                render: function (data, type, row) {
                    return `<span class="font-weight-bold">${data.fullName}</span>`;
                },
            },
            {
                data: "customer",
                render: function (data, type, row) {
                    return `<a href="/${userRole}/customer/profile/${data._id}"
                    class="font-weight-bold">${data.name}</a>`;
                },
            },
            {
                data: "total",
                render: function (data, type, row) {
                    return new Intl.NumberFormat("vi-VN", {style: "currency", currency: "VND"}).format(data);
                },
            },
            {
                data: "_id",
                render: function (data, type, row) {
                    return `
					<a href="/${userRole}/invoice/invoice-detail/${data}"
					 class="action-icon btn-edit">
                        <i class="mdi mdi-eye-outline"></i>
					</a>`;
                },
            }
        ],
    });
    renderProduct();
});