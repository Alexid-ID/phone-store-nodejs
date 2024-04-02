let btn = $("#btn");
let sidebar = $(".sidebar");
let dateTime = $(".date-time");
let employeeInfo = $(".employee-info p");

btn.on("click", function () {
	sidebar.toggleClass("active");
});

//max width 768px -> sidebar remove class active
$(window).resize(function () {
	if ($(window).width() <= 768) {
		sidebar.removeClass("active");
		btn.off("click");
	} else {
		btn.on("click", function () {
			sidebar.toggleClass("active");
		});
	}
});
