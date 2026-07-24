import React, { useEffect } from 'react'
import CheckoutSteps from '../components/CheckoutSteps'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Card, Col, Image, ListGroup, Row } from 'react-bootstrap'
import { useCreateOrderMutation } from '../slices/ordersApiSlice.js'
import { toast } from 'react-toastify'
import Message from '../components/Message'
import Loader from '../components/Loader.jsx'
import { clearCartItems } from '../slices/cartSlice'

const PlaceOrderScreen = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [createOrder, { isLoading, error }] = useCreateOrderMutation()

    const {
        shippingAddress,
        paymentMethod,
        cartItems,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
    } = useSelector((state) => state.cartR)

    useEffect(() => {
        if (
            !shippingAddress.address ||
            !shippingAddress.city ||
            !shippingAddress.postalCode ||
            !shippingAddress.country
        ) {
            navigate('/shipping')
        } else if (!paymentMethod) {
            navigate('/payment')
        }
    }, [
        paymentMethod,
        shippingAddress.address,
        shippingAddress.city,
        shippingAddress.postalCode,
        shippingAddress.country,
        navigate,
    ])

    const placeOrderHandler = async () => {
        try {
            const res = await createOrder({
                orderItems: cartItems,
                shippingAddress,
                paymentMethod,
                itemsPrice,
                taxPrice,
                shippingPrice,
                totalPrice,
            }).unwrap()
            dispatch(clearCartItems())
            navigate(`/order/${res.createOrder._id}`)
        } catch (error) {
            toast.error(error)
        }
    }

    return (
        <>
            <CheckoutSteps step1 step2 step3 step4 />
            <Row>
                <Col md={8}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Order Items</h2>
                            {cartItems.length === 0 ? (
                                <Message>Your Cart Is Empty</Message>
                            ) : (
                                <ListGroup variant='flush'>
                                    {cartItems.map((item, index) => (
                                        <ListGroup.Item key={index}>
                                            <Row>
                                                <Col md={1}>
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        fluid
                                                        rounded
                                                    />
                                                </Col>
                                                <Col>
                                                    <Link
                                                        to={`/product/${item._id}`}
                                                    >
                                                        {item.name}
                                                    </Link>
                                                </Col>
                                                <Col md={4}>
                                                    {item.qty} x {item.price} ={' '}
                                                    ${item.qty * item.price}
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    ))}
                                    <ListGroup.Item>
                                        <h2>Shipping</h2>
                                        <p>
                                            <strong>Address: </strong>
                                            <br />
                                            {shippingAddress.address}
                                            <br />
                                            {shippingAddress.city}{' '}
                                            {shippingAddress.postalCode}
                                            <br />
                                            {shippingAddress.country}
                                            <br />
                                        </p>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <h2>Payment Method</h2>
                                        <strong>Method: </strong>
                                        {paymentMethod}
                                    </ListGroup.Item>
                                </ListGroup>
                            )}
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
                <Col md={4}>
                    <Card>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h2>Order Summary</h2>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Items:</Col>
                                    <Col>$ {itemsPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Shipping:</Col>
                                    <Col>$ {shippingPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Tax:</Col>
                                    <Col>$ {taxPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Total:</Col>
                                    <Col>$ {totalPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                {error && (
                                    <Message variant='danger'>{error}</Message>
                                )}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Button
                                    type='button'
                                    className='btn-block'
                                    disabled={cartItems.length === 0}
                                    onClick={placeOrderHandler}
                                >
                                    Place Order
                                </Button>
                                {isLoading && <Loader />}
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default PlaceOrderScreen
