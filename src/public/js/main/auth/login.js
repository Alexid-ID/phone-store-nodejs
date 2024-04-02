const loginForm = $("#loginForm");
const submitLoginBtn = loginForm.find(".button-login");
const errorMsg = loginForm.find(".error-message");

submitLoginBtn.click(function (e) {
    e.preventDefault();

    const email = loginForm.find("#emailaddress").val().trim();
    const pass = loginForm.find("#password").val().trim();
    console.log(email, pass);

    if (email === "" || pass === "") {
        errorMsg.html(
            `<div class="alert alert-danger alert-dismissible fade show" role="alert">
				<strong>Oh snap!</strong> Please fill in all fields.
			</div>`
        );
        return;
    }

    $.ajax({
        type: "POST",
        url: "/api/auth/login",
        data: {
            username: email,
            password: pass,
        },
        success: function (data) {
            console.log(data);
            switch (data.cause) {
                case 'success':
                    errorMsg.html('');
                    if (data.account.role === "ADMIN") {
                        console.log("admin");
                        window.location.href = "/admin/";
                    } else {
                        console.log("employee");
                        window.location.href = "/employee/";
                    }
                    break;
                case 'incorrect':
                    errorMsg.html(
                        `<div class="alert alert-danger alert-dismissible fade show" role="alert">
                    		<strong>Oh snap!</strong> ${data.message}.
                    	</div>`
                    );
                    break;
                case 'inactive':
                    errorMsg.html(
                        `<div class="alert alert-danger alert-dismissible fade show" role="alert">
                    		<strong>Oh snap!</strong> ${data.message}.
                    	</div`
                    );
                    break;
                case 'available':
                    window.location.href = '/auth/resetPass/' + data.account;
                    break;
                case 'locked':
                    errorMsg.html(
                        `<div class="alert alert-danger alert-dismissible fade show" role="alert">
                    		<strong>Oh snap!</strong> ${data.message}.
                    	</div>`
                    );
                    break;
            }
        },
        error: function (err) {
            console.log(err);
            errorMsg.html(
                `<div class="alert alert-danger alert-dismissible fade" role="alert">
					<strong>Oh snap!</strong> ${err.responseJSON}.
				</div>`
            );
        },
    });
});
