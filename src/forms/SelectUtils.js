class SelectUtils {
    static defaultTheme() {
        return (theme) => ({
            ...theme,
            colors: {
                ...theme.colors,
                primary: '#333333',
                primary75: '#555555',
                primary50: '#777777',
                primary25: '#eeeeee'
            }
        });
    }

    static defaultStyle(customStyles) {
        return {
            control: (styles) => ({ ...styles, height: "30px", minHeight: "30px" }),
            menu: (styles) => ({ ...styles, zIndex: "10" }),
            ...customStyles
        };
    }
}

export default SelectUtils;