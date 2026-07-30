import React, { useEffect, useState } from 'react'
import Message from '../../components/Message'
import Loader from '../../components/Loader'
import FormContainer from '../../components/FormContainer'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button, Form } from 'react-bootstrap'
import {
    useGetProductByIdQuery,
    useUpdateProductMutation,
    useUploadProductImageMutation,
} from '../../slices/productApiSlice'
import { FormControl, FormGroup } from 'react-bootstrap'
import { toast } from 'react-toastify'

const ProductEditScreen = () => {
    const { id: productId } = useParams()

    const [name, setName] = useState('')
    const [price, setPrice] = useState(0)
    const [image, setImage] = useState('')
    const [brand, setBrand] = useState('')
    const [category, setCategory] = useState('')
    const [countInStock, setCountInStock] = useState('')
    const [description, setDescription] = useState('')

    const {
        data: product,
        isLoading,
        error,
    } = useGetProductByIdQuery(productId)

    const [updateProduct, { isLoading: loadingUpdate }] =
        useUpdateProductMutation()

    const [uploadProductImage] = useUploadProductImageMutation()

    const navigate = useNavigate()

    useEffect(() => {
        if (product) {
            setName(product.name)
            setPrice(product.price)
            setImage(product.image)
            setBrand(product.brand)
            setCategory(product.setCategory)
            setCountInStock(product.countInStock)
            setDescription(product.description)
        }
    }, [product])

    const submitHandler = async (e) => {
        e.preventDefault()
        try {
            await updateProduct({
                _id: productId,
                name,
                price,
                image,
                brand,
                category,
                countInStock,
                description,
            }).unwrap()
            toast.success('Product updated successfully')
            navigate('/admin/productlist')
        } catch (err) {
            toast.error(err?.data?.message || err.error)
        }
    }

    const uploadFileHandler = async (e) => {
        const formData = new FormData()
        formData.append('image', e.target.files[0])
        try {
            const res = await uploadProductImage(formData).unwrap()
            toast.success(res.message)
            setImage(res.image)
        } catch (err) {
            toast.error(err?.data?.message || err.error)
        }
    }

    return (
        <>
            <Link to='/admin/productlist' className='btn btn-light my-3'>
                Go Back
            </Link>
            <FormContainer>
                <h1>Edit Product</h1>
                {loadingUpdate && <Loader />}
                {isLoading ? (
                    <Loader />
                ) : error ? (
                    <Message variant='danger'>{error}</Message>
                ) : (
                    <Form onSubmit={submitHandler}>
                        <FormGroup controlId='name'>
                            <Form.Label>Name:</Form.Label>
                            <FormControl
                                type='name'
                                placeholder='Enter Product Name'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </FormGroup>

                        <FormGroup controlId='price'>
                            <Form.Label>Price:</Form.Label>
                            <FormControl
                                type='number'
                                placeholder='Enter Price'
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </FormGroup>

                        <FormGroup controlId='image' className='my-2'>
                            <Form.Label>Image:</Form.Label>
                            <FormControl
                                type='text'
                                placeholder='Enter Image Url'
                                value={image}
                                onChange={(e) => setImage(e.target.value)}
                            />
                            <Form.Control
                                className='my-2'
                                type='file'
                                label='Choose Image File'
                                onChange={uploadFileHandler}
                            ></Form.Control>
                        </FormGroup>

                        <Form.Group controlId='brand' className='my-2'>
                            <Form.Label>Brand</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder='Enter brand'
                                value={brand}
                                onChange={(e) => setBrand(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId='countInStock' className='my-2'>
                            <Form.Label>Count In Stock</Form.Label>
                            <Form.Control
                                type='number'
                                placeholder='Enter countInStock'
                                value={countInStock}
                                onChange={(e) =>
                                    setCountInStock(e.target.value)
                                }
                            />
                        </Form.Group>

                        <Form.Group controlId='category' className='my-2'>
                            <Form.Label>Category</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder='Enter category'
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId='description' className='my-2'>
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder='Enter description'
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </Form.Group>

                        <FormGroup>
                            <Button
                                type='submit'
                                variant='primary'
                                className='my-2'
                            >
                                Update
                            </Button>
                        </FormGroup>
                    </Form>
                )}
            </FormContainer>
        </>
    )
}

export default ProductEditScreen
