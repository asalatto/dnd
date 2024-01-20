import './index.scss';
import { useState, useEffect, ChangeEvent } from 'react';
import { Input } from '../Utils';
import { getApiData } from '../../utils';


interface SearchProps {
    name?: string;
    endpoint: string[];
    value?: string;
    updateFunction: (event: any, url: string) => Promise<any>;
    placeholder: string;
}

export default function Search({
    name="",
    endpoint,
    value="",
    updateFunction,
    ...props
}: SearchProps) {

    const [data, setData] = useState<any[]>([]);
    const [filteredOptions, setFilteredOptions] = useState<any[]>([]);
    const [chosen, setChosen] = useState(value);

    useEffect(() => {
        getData();
    }, [])

    const getData = async () => {
        let all_data = [];
        for (const path of endpoint) {
            await getApiData(path).then(resp => {
                all_data = [...all_data, ...resp.results];
            });
        }
        setData(all_data);
    }

    const getFilteredData = (event: ChangeEvent, url: string): void => {
        const element = event.target as HTMLInputElement;
        const query = element.value;
        const results = data ?? null;

        // updateFunction(event, url);
        setChosen(query);

        if (!query) {
            setFilteredOptions([]);
            return;
        }
        if (data.length === 0) {
            return;
        }

        const filtered_results = results.filter(i => i.name.toLowerCase().includes(query.toLowerCase())) || [];
        setFilteredOptions(filtered_results);
    }

    const selectOption = (event, url: string) => {
        const clicked = event.target.innerText.trim();
        updateFunction(event, url);
        setChosen(clicked);
        setFilteredOptions([]);
    }

    const display = filteredOptions.length > 0 ? 'block' : 'none';

    return (
        <div className="search-input" data-endpoint={endpoint}>
            <Input input_classes="form-field" id={name} name={name} onChange={(event) => getFilteredData(event, ``)} value={chosen} {...props} />
            <div className="search-options" style={{ display: display }}>
                {
                    filteredOptions?.map(opt => {
                        return <a 
                            key={opt.index}
                            data-index={opt.index}
                            id={name}
                            onClick={(event) => selectOption(event, opt.url.replace('/api/', ''))}
                        >{opt.name}</a>;
                    })
                }
            </div>
        </div>
    )
}