import {Helmet} from 'react-helmet-async'

export default function ({title}){
    return (
        <Helmet>
            <title>{`${title} - RailEasy`}</title>
        </Helmet>
    )
}