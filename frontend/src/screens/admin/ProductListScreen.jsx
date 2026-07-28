import React from 'react'
import {
    useCreateProductMutation,
    useDeleteProductMutation,
    useGetProductsQuery,
} from '../../slices/productApiSlice.js'
import { Button, Col, Row, Table } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { FaEdit, FaTrash } from 'react-icons/fa'
import Loader from '../../components/Loader.jsx'
import Message from '../../components/Message.jsx'
import { toast } from 'react-toastify'

const ProductListScreen = () => {
    const { data: products, isLoading, error, refetch } = useGetProductsQuery()

    const [createProduct, { isLoading: loadingCreate }] =
        useCreateProductMutation()

    const [deleteProduct, { isLoading: loadingDelete }] =
        useDeleteProductMutation()

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure ?')) {
            try {
                await deleteProduct(id)
                toast.success('Product Deleted')
                refetch()
            } catch (error) {
                toast.error(error?.data?.message || error.error)
            }
        }
    }

    const createProductHandler = async () => {
        if (
            window.confirm(
                'Are you sure that you want to create a new product?',
            )
        ) {
            try {
                await createProduct()
                toast.success('Product Created')
                refetch()
            } catch (error) {
                toast.error(error?.data.message || error.message)
            }
        }
    }

    return (
        <>
            <Row className='align-items-center'>
                <Col>
                    <h1>Products</h1>
                </Col>
                <Col className='text-end'>
                    <Button
                        className='btn-sm m-3'
                        onClick={createProductHandler}
                    >
                        <FaEdit /> Create Product
                    </Button>
                </Col>
            </Row>
            {loadingCreate && <Loader />}
            {loadingDelete && <Loader />}
            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant='danger'>{error}</Message>
            ) : (
                <>
                    <Table striped hover responsive className='table-sm'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>In Stock</th>
                                <th>Category</th>
                                <th>Brand</th>
                                <th>Edit / Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product._id}>
                                    <td>{product._id}</td>
                                    <td>{product.name}</td>
                                    <td>{product.price}</td>
                                    <td>{product.countInStock}</td>
                                    <td>{product.category}</td>
                                    <td>{product.brand}</td>
                                    <td>
                                        <LinkContainer
                                            to={`/admin/product/${product._id}/edit`}
                                        >
                                            <Button
                                                variant='light'
                                                className='btn-sm mx-2'
                                            >
                                                <FaEdit />
                                            </Button>
                                        </LinkContainer>
                                        <Button
                                            variant='danger'
                                            className='btn-sm'
                                        >
                                            <FaTrash
                                                style={{ color: 'white' }}
                                                onClick={() =>
                                                    deleteHandler(product._id)
                                                }
                                            />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </>
            )}
        </>
    )
}

export default ProductListScreen
