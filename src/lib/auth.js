export function getToken() {
    return localStorage.getItem("token");
  }
  
  export function isLoggedIn() {
    return !!getToken();
  }
  
  export function logout() {
    localStorage.removeItem("token");
  }