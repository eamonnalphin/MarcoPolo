

$(document).ready(function(){
    $("#registerBtn").attr("disabled", true)

    $('#confirmPassword').focusout(function(){
        var pass = $('#password').val();
        var pass2 = $('#confirmPassword').val();
        if(pass != pass2){
            console.log("passwords don't match")
            $("#errorMessage").text("Passwords do not match.")
            $("#registerBtn").attr("disabled", true)
        }else{
            $("#registerBtn").attr("disabled", false)
        }

    });
});