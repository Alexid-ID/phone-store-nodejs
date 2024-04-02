$(document).ready(function () {
    console.log("account.js");

    // ------------------ Handle Datatable ------------------
    function renderAccount() {
        $.ajax({
            url: "/api/account",
            method: "GET",
            async: false,
            success: function (data) {
                console.log(data);
                table.rows.add(data).draw();
            },
            error: function (err) {
                console.log(err.responseText);
            },
        });
    }

    const data = [];

    const table = $("#accounts-datatable").DataTable({
        keys: true,
        responsive: true,
        language: {
            paginate: {
                previous: "<i class='mdi mdi-chevron-left'>",
                next: "<i class='mdi mdi-chevron-right'>",
            },
            info: "Showing customers _START_ to _END_ of _TOTAL_",
            lengthMenu:
                'Display <select class=\'custom-select custom-select-sm ml-1 mr-1\'><option value="10">10</option><option value="20">20</option><option value="-1">All</option></select> accounts',
        },
        pageLength: 10,
        rowId: "_id",
        select: {style: "multi"},
        order: [[2, "asc"]],
        drawCallback: function () {
            $(".dataTables_paginate > .pagination").addClass("pagination-rounded");
        },
        columns: [
            // { data: '_id'},
            {
                data: "fullName",
                render: function (data, type, row) {
                    return `
					<a href="/admin/employee/profile/${row._id}" class="font-weight-bold">${data}</a>
					`;
                },
            },
            {
                data: "email",
                render: function (data, type, row) {
                    return `<span class="email">${data}</span>`;
                },
            },
            {
                data: "role",
                render: function (data, type, row) {
                    return `<span class="role">${data}</span>`;
                },
            },
            {
                data: "createdAt",
                render: function (data, type, row) {
                    return new Date(data).toLocaleDateString();
                },
            },
            {
                data: "isActive",
                render: function (data, type, row) {
                    return data
                        ? `<span class="badge badge-success-lighten">Active</span>`
                        : `<span class="badge badge-danger-lighten">Inactive</span>`;
                },
            },
            {
                data: "isLocked",
                render: function (data, type, row) {
                    return data
                        ? `<span class="badge badge-success-lighten">UnLocked</span>`
                        : `<span class="badge badge-danger-lighten">Locked</span>`;
                },
            },
            {
                data: null,
                render: function (data, type, row) {
                    //     isActive - isLocked: F - F => Not click active link
                    //     isActive - isLocked: T - F => Not change first password
                    //     isActive - isLocked: T - T => Activated account
                    //     !isActive - isLocked: F - T => Block account
                    return `
                        ${
                        !data.isActive && !data.isLocked
                            ? `<span class="badge badge-danger-lighten">Not click active link</span>`
                            : data.isActive && !data.isLocked
                                ? `<span class="badge badge-warning-lighten">Not change first password</span>`
                                : data.isActive && data.isLocked
                                    ? `<span class="badge badge-success-lighten">Activated account</span>`
                                    : `<span class="badge badge-danger-lighten">Block account</span>`
                    }`;
                }
            },
            {
                data: null,
                render: function (data, type, row) {
                    return `
						${
                        data.isLocked
                            ? `<button class="btn-toggle-block btn btn-outline-danger btn-block btn-lock" data-toggle="modal" data-target="#confirmBlockAccountModal">Lock</button>`
                            : `<button class="btn-toggle-block btn btn-outline-success btn-block btn-unlock" data-toggle="modal" data-target="#confirmBlockAccountModal">Unlock</button>`
                    }
					`;
                },
            },
            {
                data: null,
                render: function (data, type, row) {
                    return `<button class="btn btn-outline-primary resend-btn">Resend</button>`;
                },
            }
        ],
    });
    renderAccount();

    // ------------------ Handle Register ------------------
    const registerForm = $("#registerForm");
    const registerBtn = $(registerForm).find(".btn-submit");

    registerBtn.on("click", function (e) {
        e.preventDefault();
        const fullName = $(registerForm).find("#fullname").val().trim();
        const email = $(registerForm).find("#email").val().trim();
        const role = $(registerForm).find("#role");
        const roleSelected = role.find(":selected").attr("value");
        console.log("register:", fullName, email, roleSelected);

        if (!fullName || !email || !roleSelected) {
            setToastMsg(400, "Please fill all fields");
            return;
        }


        // add loading to button register
        registerBtn.html(
            `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...`
        );

        $.ajax({
            url: "/api/auth/register",
            method: "POST",
            data: {
                fullname: fullName,
                email: email,
                role: roleSelected,
            },
            beforeSend: function () {
                registerBtn.html(
                    `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...`
                );
            },
            success: function (data) {
                registerBtn.html("Register");
                console.log("success");
                // console.log(data);
                // console.log(data.data);

                if (data.status == 200) {
                    setToastMsg(data.status, data.message);
                    // reset form
                    registerForm.trigger("reset");
                    // reset data table
                    table.row.add(data.data).draw();
                } else {
                    setToastMsg(data.status, data.message);
                }
            },
            error: function (err) {
                console.log("ERR");
                // console.log(err);
                // console.log(err.responseJSON);
                setToastMsg(err.status, err.responseJSON.message[0].message);
            },
        });
    });

    // ------------------ Handle Resend Mail ------------------
    const resendBtn = $(".resend-btn");

    resendBtn.each(function (index, item) {
        $(item).on("click", function () {
            let email = $(this).parent().parent().find(".email").text();
            console.log(email);
            $.ajax({
                url: "/api/auth/resend",
                method: "POST",
                async: false,
                data: {
                    email: email,
                },
                success: function (data) {
                    console.log("success");
                    // console.log(data);
                },
                error: function (err) {
                    console.log("ERR");
                    console.log(err.responseText);
                },
            });
        });
    });

    // ------------------ Handle Edit Account ------------------
    const btnEdit = $(".btn-edit");

    btnEdit.on("click", function () {
        let id = $(this).parent().parent().attr("id");
        console.log(id);
        window.location.href = `/admin/profile/${id}`;
    });

    // ------------------ Handle Block Account ------------------
    const btnToggleBlock = $(".btn-toggle-block");
    const confirmBlockAccountModal = $("#confirmBlockAccountModal");
    const confirmDeleteBtn = $(confirmBlockAccountModal).find(".btn-confirm");

    btnToggleBlock.each(function (index, item) {
        $(item).on("click", function (e) {
            e.preventDefault();
            let id = $(this).parent().parent().attr("id");
            let isLocked = $(this).parent().parent().find("td:nth-child(5)").text().trim() === "Inactive" ? true : false;
            // console.log(id);
            // console.log(isLocked);
            confirmBlockAccountModal
                .find(".modal-body")
                .text(isLocked ? "Are you sure to unlock this account?" : "Are you sure to lock this account?");

            confirmDeleteBtn.on("click", function (e) {
                e.preventDefault();
                $.ajax({
                    url: `/api/account/block/${id}`,
                    method: "PUT",
                    async: false,
                    success: function (data) {
                        console.log("success");
                        // console.log(data);
                        if (data.status == 400) {
                            setToastMsg(data.status, data.message);
                            confirmBlockAccountModal.modal("hide");
                        } else {
                            confirmBlockAccountModal.modal("hide");
                            //
                            if (data.isActive) {
                                setToastMsg(200, "Unlock account successfully");
                            } else {
                                setToastMsg(200, "Lock account successfully");
                            }
                            setTimeout(() => {
                                window.location.reload();
                            });
                        }
                    },
                    error: function (err) {
                        console.log("ERR");
                        console.log(err.responseText);
                        setToastMsg(err.status, err.responseText);
                    },
                });
            });
        });
    });
});

function setToastMsg(status, msg) {
    const toastContainer = $(".toast-container");
    toastContainer.empty();
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
