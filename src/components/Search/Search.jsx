import './Search.css';
import * as React from 'react'
import Input from '../Input/Input';
import { getApiData } from '../../utils';

export default function Search({name="", endpoint="", value="", updateFunction, ...props}) {
    const [data, setData] = React.useState();
    const [filteredOptions, setFilteredOptions] = React.useState([]);
    const [chosen, setChosen] = React.useState(value);

    React.useEffect(() => {
        getApiData(endpoint).then(data => setData(data));
    }, [])

    function getFilteredData(event) {
        const query = event.target.value;
        const results = data?.results || null;

        updateFunction(event);
        setChosen(query);

        if (!query) {
            setFilteredOptions([]);
            return;
        }
        if (!data) {
            return;
        }

        const filteredResults = results.filter(i => i.name.toLowerCase().includes(query.toLowerCase())) || [];
        setFilteredOptions(filteredResults);
    }

    function selectOption(event) {
        const clicked = event.target.innerText.trim();
        updateFunction(event);
        setChosen(clicked);
        setFilteredOptions([]);
    }

    return (
        <div className="search-input">
            <Input id={name} name={name} onChange={getFilteredData} value={chosen} {...props} />
            <div className="search-options">
                {
                    filteredOptions?.map(opt => {
                        return <a key={opt.index} data-index={opt.index} id={name} onClick={selectOption}>{opt.name}</a>;
                    })
                }
            </div>
        </div>
    )
}