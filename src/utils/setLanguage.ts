const setLanguage= (locale: any) => {
    if (locale) {
        localStorage.setItem('locale', locale);
    }
};
export default setLanguage;