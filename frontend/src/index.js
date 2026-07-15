import React from 'react'
import ReactDOM from 'react-dom/client'
import './assets/styles/index.css'
import './assets/styles/bootstrap.custom.css'
import App from './App'
// import 'bootstrap/dist/css/bootstrap.min.css'
import {
    createBrowserRouter,
    createRoutesFromElements,
    RouterProvider,
    Route,
} from 'react-router-dom'
import HomeScreen from './screens/HomeScreen'
import ProductScreen from './screens/ProductScreen'
import { Provider } from 'react-redux'
import store from './store'

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path='/' element={<App />}>
            <Route index={true} path='/' element={<HomeScreen />} />
            <Route path='product/:id' element={<ProductScreen />} />
        </Route>,
    ),
)

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
    <Provider store={store}>
        <RouterProvider router={router} />
    </Provider>,
)
