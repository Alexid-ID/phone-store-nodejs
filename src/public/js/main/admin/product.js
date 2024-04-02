$(document).ready(function () {
    // ------------------ Handle Datatable ------------------
    function renderProduct() {
        $.ajax({
            url: "/api/product",
            method: "GET",
            async: false,
            success: function (data) {
                console.log("success: ", data.length);
                // console.log(data);
                table.rows.add(data).draw();
                handleDeleteProduct();
            },
            error: function (err) {
                console.log(err.responseText);
            },
        });
    }

    const data = [];
    const table = $("#products-datatable").DataTable({
        keys: true,
        responsive: true,
        language: {
            paginate: {
                previous: "<i class='mdi mdi-chevron-left'>",
                next: "<i class='mdi mdi-chevron-right'>",
            },
            info: "Showing customers _START_ to _END_ of _TOTAL_",
            lengthMenu:
                'Display <select class=\'custom-select custom-select-sm ml-1 mr-1\'><option value="10">10</option><option value="20">20</option><option value="-1">All</option></select> products',
        },
        pageLength: 20,
        rowId: "_id",
        select: {style: "multi"},
        order: [[2, "desc"]],
        drawCallback: function () {
            $(".dataTables_paginate > .pagination").addClass("pagination-rounded");
        },
        columns: [
            {
                data: null,
                render: function (data, type, row) {
                    return `<img src="${data.image}" alt="product-img" title="product-img" class="rounded mr-3" height="48" style="max-width: 60px; object-fit: cover; width: 60px;" />
                    <p class="m-0 d-inline-block align-middle font-16">
                        <a href="/admin/product-details/${data._id}" class="text-body text-truncate d-inline-block" style="max-width: 200px;">${data.name}</a>
                    </p>`;
                },
            },
            {
                data: "category",
                render: function (data, type, row) {
                    return `<span class="font-weight-bold">${data}</span>`;
                },
            },
            {
                data: "createdAt",
                render: function (data, type, row) {
                    return new Date(data).toLocaleString();
                },
            },
            {
                data: "importPrice",
                render: function (data, type, row) {
                    return new Intl.NumberFormat("vi-VN", {style: "currency", currency: "VND"}).format(data);
                },
            },
            {
                data: "retailPrice",
                render: function (data, type, row) {
                    return new Intl.NumberFormat("vi-VN", {style: "currency", currency: "VND"}).format(data);
                },
            },
            {
                data: "quantity",
                render: function (data, type, row) {
                    return `<span class="fw-bold">${data}</span>`;
                },
            },
            {
                data: "_id",
                render: function (data, type, row) {
                    return `
					<a href="/admin/edit-product/${data}" class="action-icon btn-edit"><i class="mdi mdi-square-edit-outline"></i></a>
					<a href="" data-toggle="modal" data-target="#confirmDeleteModal" class="action-icon btn-delete delete-product-btn"><i class="mdi mdi-delete"></i></a>`;
                },
            },
        ],
    });
    renderProduct();

    //------------------ Handle Delete Product ------------------

});

function handleDeleteProduct() {
    const confirmDeleteModal = $("#confirmDeleteModal");
    const deleteProductBtn = $(".delete-product-btn");
    const confirmDeleteBtn = $(confirmDeleteModal).find(".btn-confirm");

    deleteProductBtn.each(function (index, item) {
        $(item).on("click", function (e) {
            e.preventDefault();
            console.log("deleteProductBtn: ", $(this).parent().parent().attr("id"));
            let id = $(this).parent().parent().attr("id");
            let name = $(this).parent().parent().find("td:nth-child(1)").text();
            console.log(id, name);
            confirmDeleteModal
                .find(".modal-body")
                .html(`<p>Are you sure you want to delete <strong>${name}</strong>?</p>`);

            confirmDeleteBtn.on("click", function (e) {
                e.preventDefault();
                $.ajax({
                    url: `/api/product/${id}`,
                    method: "DELETE",
                    async: false,
                    success: function (data) {
                        console.log("success");
                        console.log(data);
                        confirmDeleteModal.modal("hide");
                        setToastMsg(200, "Delete product success");

                    },
                    error: function (err) {
                        console.log("ERR");
                        console.log(err.responseText);
                        confirmDeleteModal.modal("hide");
                        setToastMsg(400, err.responseText);
                    },
                });
            });
        });
    });
}

function setToastMsg(status, msg) {
    const toastContainer = $(".toast-container");
    let toastHtml = `
	<div
		id="toast-msg"
		class="alert alert-${status === 200 ? "success" : "danger"}
		 alert-dismissible border-0 fade show"
		role="alert"
		style="position: fixed; margin: 1rem; right: 0; bottom: 0; z-index: 9999;"
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