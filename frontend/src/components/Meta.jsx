import React from 'react'
import { Helmet } from 'react-helmet-async'

const Meta = ({ title, description, keywords }) => {
    return (
        <Helmet>
            <title>{title}</title>
            <meta name='description' content={description} />
            <meta name='keywords' content={keywords} />
        </Helmet>
    )
}

Meta.defaultProps = {
    title: 'Welcome to Pro Shop',
    description: 'We sell best Products at Fair Prices',
    keywords: 'electronics, appliances, fair-price , fair price',
}

export default Meta
