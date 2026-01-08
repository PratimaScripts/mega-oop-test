export const getState = () => {
    return {
        linkLoading: false,
        isHovered: false,
        isSortCodeValid: true,
        isBankAcNumberValid: true,
        showComplete: false,
        paymentType: '',
        accHolderName: '',
        accSortCode: 0,
        accNumber: 0,
        accHolErr: '',
        sortCodeErr: '',
        bankAccNumberErr: '',
        connectAccId: '',
    }
}

export const getStateCardSetup = () => {
    return {
        // State
        cusId: '',
        paymentMethodId: "",
        saveCardSuccess: false,
        cards: [],
        cardErrors: '',
        showEditCard: false,
        visible: false,
        confirmLoading: false,
        // Edit card State
        holderName: 'default',
        month: 1,
        year: 2021,
        zip: '',
        loading: false,
        editSaveBtn: false,
        cardId: '',
        initialZip: '',
        validZip: 'default',
        showError: '',
        editZipValid: true
    }
}