import { Col, Row } from 'react-bootstrap'
import Product from '../components/Product'
import { useGetProductsQuery } from '../slices/productApiSlice'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { Link, useParams } from 'react-router-dom'
import Paginate from '../components/Paginate'
import ProductCarousel from '../components/ProductCarousel'

const HomeScreen = () => {
    const { pageNumber, keyword } = useParams()
    const { data, isError, isLoading } = useGetProductsQuery({
        keyword,
        pageNumber,
    })

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
            {!keyword ? (
                <ProductCarousel />
            ) : (
                <Link to='/' className='btn btn-light mb-4'>
                    Go Back
                </Link>
            )}
            {isLoading ? (
                <Loader />
            ) : (
                <>
                    {keyword ? (
                        <h1>Search Results</h1>
                    ) : (
                        <h1>Latest Products</h1>
                    )}
                    <Row>
                        {data.products.map((product) => (
                            <Col sm={12} md={6} lg={4} xl={3} key={product._id}>
                                <Product product={product} />
                            </Col>
                        ))}
                    </Row>
                    <Paginate
                        pages={data.pages}
                        page={data.page}
                        keyword={keyword ? keyword : ''}
                    />
                </>
            )}
        </>
    )
}

export default HomeScreen
