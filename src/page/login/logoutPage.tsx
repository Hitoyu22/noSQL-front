
function LogoutPage() {

    localStorage.clear();
  
    window.location.href = "/login";
  
    return null;
  
  };
  

export default LogoutPage;