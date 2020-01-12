

$(document).ready(function(){
    $("#registerBtn").prop("disabled",true)

    $('#confirmPassword').focusout(function(){
        var pass = $('#userPassword').val();
        var pass2 = $('#confirmPassword').val();

        if(pass.trim() == "" || pass2.trim() == ""){
            $("#errorMessage").text("Password cannot be empty.")
        }else if(pass == pass2){
            $("#registerBtn").prop("disabled",false);
        }else{
            console.log("passwords don't match")
            $("#errorMessage").text("Passwords do not match.")
            $("#registerBtn").prop("disabled",true)
        }

    });
});