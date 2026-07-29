import { Col, Row } from 'react-bootstrap'
import Product from '../components/Product'
import { useGetProductsQuery } from '../slices/productApiSlice'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { useParams } from 'react-router-dom'
import Paginate from '../components/Paginate'

const HomeScreen = () => {
    const { pageNumber } = useParams()
    const { data, isError, isLoading } = useGetProductsQuery({ pageNumber })

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
                {data.products.map((product) => (
                    <Col sm={12} md={6} lg={4} xl={3} key={product._id}>
                        <Product product={product} />
                    </Col>
                ))}
            </Row>
            <Paginate pages={data.pages} page={data.page} />
        </>
    )
}

export default HomeScreen
