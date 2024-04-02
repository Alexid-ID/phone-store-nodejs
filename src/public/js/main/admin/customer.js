$(document).ready(function () {
    // ------------------ Handle Datatable ------------------
    function renderCustomer() {
        $.ajax({
            url: "/api/customer",
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
    const userRole = $("#currentUser").data("role") ? $("#currentUser").data("role") : `${userRole}}`;
    const table = $("#customer-datatable").DataTable({
        keys: true,
        responsive: true,
        language: {
            paginate: {
                previous: "<i class='mdi mdi-chevron-left'>",
                next: "<i class='mdi mdi-chevron-right'>",
            },
            info: "Showing customers _START_ to _END_ of _TOTAL_",
            lengthMenu:
                'Display <select class=\'custom-select custom-select-sm ml-1 mr-1\'><option value="10">10</option><option value="20">20</option><option value="-1">All</option></select> customers',
        },
        pageLength: 10,
        rowId: "_id",
        select: {style: "multi"},
        order: [[3, "asc"]],
        drawCallback: function () {
            $(".dataTables_paginate > .pagination").addClass("pagination-rounded");
        },
        columns: [
            {
                data: null,
                render: function (data, type, row) {
                    return `<p class="m-0 d-inline-block align-middle font-16">
                        <span href="" class="text-body text-truncate d-inline-block" style="max-width: 200px;">${data.name}</span>
                    </p>`;
                },
            },
            {
                data: null,
                render: function (data, type, row) {
                    return `<span class="text-body text-truncate d-inline-block" style="max-width: 200px;">${data.phone}</span>`;
                }
            },
            {
                data: null,
                render: function (data, type, row) {
                    return `<span class="text-body text-truncate d-inline-block">${data.address}</span>`;
                },
            },
            {
                data: "createdAt",
                render: function (data, type, row) {
                    return new Date(data).toLocaleDateString();
                },
            },
            {
                data: "_id",
                render: function (data, type, row) {
                    return `<a href="/${userRole}/customer/profile/${data}" class="btn btn-outline-primary btn-sm"> <i class="mdi mdi-eye"></i> </a>`;
                },
            },
        ],
    });
    renderCustomer();
});

function setToastMsg(status, msg) {
    const toastContainer = $(".toast-container");
    let toastHtml = `
	<div
		id="toast-msg"
		class="alert alert-${status === 200 ? "success" : "danger"}
		 alert-dismissible border-0 fade show"
		role="alert"
		style="position: fixed; margin: 1rem; right: 0; bottom: 0"
	>
		<i class="dripicons-checkmark mr-2"></i>
		<button type="button" class="close" data-dismiss="alert" aria-label="Close">
			<span aria-hidden="true">&times;</span>
		</button>
		<span class="msg">
		<strong>${status === 200 ? "Success" : "Failed"}
		 - </strong>${msg}</span>
	</div>
	`;

    toastContainer.html(toastHtml);
    setTimeout(() => {
        $("#toast-msg").alert("close");
    }, 3000);
}
