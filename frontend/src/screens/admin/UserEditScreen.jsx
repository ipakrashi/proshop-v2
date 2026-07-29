import React, { useEffect, useState } from 'react'
import Message from '../../components/Message'
import Loader from '../../components/Loader'
import FormContainer from '../../components/FormContainer'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button, Form } from 'react-bootstrap'
import {
    useGetUserDetailsQuery,
    useUpdateUserMutation,
} from '../../slices/usersApiSlice'
import { FormControl, FormGroup } from 'react-bootstrap'
import { toast } from 'react-toastify'

const UserEditScreen = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [isAdmin, setIsAdmin] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const { data: user, isLoading, error, refetch } = useGetUserDetailsQuery(id)
    console.log(user)

    const [updateUser, { isLoading: loadingUser }] = useUpdateUserMutation()

    useEffect(() => {
        if (user) {
            setName(user.name)
            setEmail(user.email)
            setIsAdmin(user.isAdmin)
            setPassword(password)
            setConfirmPassword(confirmPassword)
        }
    }, [user, password, confirmPassword])

    const submitHandler = async (e) => {
        e.preventDefault()
        if (password === confirmPassword) {
            try {
                await updateUser({
                    _id: id,
                    name,
                    email,
                    isAdmin,
                    password,
                }).unwrap()
                toast.success('User updated successfully')
                refetch()
                navigate('/admin/userlist')
            } catch (err) {
                toast.error(err?.data?.message || err.error)
            }
        } else {
            toast.error('Passwords Do Not Match')
        }
    }

    return (
        <>
            <Link to='/admin/userlist' className='btn btn-light my-3'>
                Go Back
            </Link>
            <FormContainer>
                <h1>Edit User</h1>
                {loadingUser && <Loader />}
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
                                placeholder='Enter User Name'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </FormGroup>

                        <FormGroup controlId='email'>
                            <Form.Label>Email:</Form.Label>
                            <FormControl
                                type='text'
                                placeholder='Enter email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </FormGroup>

                        <FormGroup controlId='isAdmin' className='my-2'>
                            <Form.Check
                                type='checkbox'
                                label='Is Admin'
                                value={isAdmin}
                                checked={isAdmin}
                                onChange={(e) => setIsAdmin(e.target.checked)}
                            ></Form.Check>
                        </FormGroup>

                        <FormGroup controlId='password' className='my-2'>
                            <Form.Label>password:</Form.Label>
                            <FormControl
                                type='password'
                                placeholder='Enter Password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </FormGroup>

                        <Form.Group
                            controlId='confirmPassword'
                            className='my-2'
                        >
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control
                                type='password'
                                placeholder='Confirm Password'
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
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

export default UserEditScreen
