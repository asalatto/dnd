import './Search.scss';
import { useState, useEffect } from 'react';
import Input from '../Input/Input';
import { getApiData } from '../../utils';


export default function Search({name="", endpoint="", value="", updateFunction, ...props}) {
    const [data, setData] = useState();
    const [filteredOptions, setFilteredOptions] = useState([]);
    const [chosen, setChosen] = useState(value);

    useEffect(() => {
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

        const filtered_results = results.filter(i => i.name.toLowerCase().includes(query.toLowerCase())) || [];
        setFilteredOptions(filtered_results);
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