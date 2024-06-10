const useAuthService = () => {
  const removeUserData = () => {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userToken');
    localStorage.removeItem('tokenType');
    localStorage.removeItem('userName');
    localStorage.removeItem('userImage');
    localStorage.removeItem('userPhone');
    localStorage.removeItem('userAddress');
    localStorage.removeItem('userGender');
    localStorage.removeItem('userBirthdate');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userCreateTime');
    localStorage.removeItem('userUpdateTime');
    localStorage.removeItem('cart');
  };

  return {
    removeUserData,
  };
};

export default useAuthService;
