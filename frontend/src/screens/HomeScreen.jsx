import { Col, Row } from 'react-bootstrap'
import Product from '../components/Product'
import { useGetProductsQuery } from '../slices/productApiSlice'
import Loader from '../components/Loader'
import Message from '../components/Message'

const HomeScreen = () => {
    const { data: products, isError, isLoading } = useGetProductsQuery()

    if (isLoading) {
        return <Loader />
    }

    if (isError) {
        return (
            <Message variant='danger'>
                <h4>
                    {isError?.data?.message ||
                        isError.error ||
                        'An error occurred'}
                </h4>
            </Message>
        )
    }

    return (
        <>
            <h1>Latest Products</h1>
            <Row>
                {products.map((product) => (
                    <Col sm={12} md={6} lg={4} xl={3} key={product._id}>
                        <Product product={product} />
                    </Col>
                ))}
            </Row>
        </>
    )
}

export default HomeScreen
