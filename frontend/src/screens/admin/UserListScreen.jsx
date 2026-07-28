import React from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import Message from '../../components/Message'
import Loader from '../../components/Loader'
import { Button, Table } from 'react-bootstrap'
import { FaCheck, FaEdit, FaTimes, FaTrash } from 'react-icons/fa'
import { useGetUsersQuery } from '../../slices/usersApiSlice'

const deleteHandler = (id) => {
    alert(id)
}

const UserListScreen = () => {
    const { data: users, isLoading, error, refetch } = useGetUsersQuery()
    console.log(users)

    return (
        <>
            <h1>Users</h1>
            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant='danger'>{error}</Message>
            ) : (
                <Table striped bordered hover responsive className='table-sm'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Admin</th>
                            <th>Edit/ Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id}>
                                <td>{user._id}</td>
                                <td>{user.name}</td>
                                <td>
                                    <a
                                        href={`mailto:${user.email}`}
                                        style={{ textDecoration: 'none' }}
                                    >
                                        {user.email}
                                    </a>
                                </td>
                                <td>
                                    {user.isAdmin ? (
                                        <FaCheck style={{ color: 'green' }} />
                                    ) : (
                                        <FaTimes style={{ color: 'red' }} />
                                    )}
                                </td>

                                <td>
                                    <LinkContainer
                                        to={`/admin/user/${user._id}/edit`}
                                    >
                                        <Button
                                            variant='light'
                                            className='btn-sm mx-2'
                                        >
                                            <FaEdit />
                                        </Button>
                                    </LinkContainer>
                                    <Button variant='danger' className='btn-sm'>
                                        <FaTrash
                                            style={{ color: 'white' }}
                                            onClick={() =>
                                                deleteHandler(user._id)
                                            }
                                        />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </>
    )
}
export default UserListScreen
