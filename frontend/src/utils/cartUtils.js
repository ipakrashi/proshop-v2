export const addDecimals = (num) => {
    return Number((Math.round(num * 100) / 100).toFixed(2))
}

export const updateCart = (state) => {
    // Calculate Items Price
    state.itemsPrice = addDecimals(
        state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0),
    )
    // Calculate Shipping Price (if Order is >$100 then Free else $10 )
    state.shippingPrice = addDecimals(state.itemsPrice > 100 ? 0 : 10)
    // Calculate Tax Price
    state.taxPrice = addDecimals(Number(state.itemsPrice * 0.15).toFixed(2))
    // Calculate Total Price
    state.totalPrice = Number(
        (
            Number(state.itemsPrice) +
            Number(state.shippingPrice) +
            Number(state.taxPrice)
        ).toFixed(2),
    )
    localStorage.setItem('cart', JSON.stringify(state))
    return state
}
