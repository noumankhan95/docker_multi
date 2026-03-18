import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';

function ShowData() {
    const [seenIndexes, setseenIndexes] = useState([])
    const [values, setvalues] = useState({})
    const [idx, setidx] = useState("")

    useEffect(async () => {
        const res = await fetch("/api/values/current")
        const data = await res.json()
        setvalues({ values: data.data })
    }, [])
    useEffect(async () => {
        const res = await fetch("/api/values/all")
        const data = await res.json()
        setseenIndexes(data.data)
    }, [])
    return (
        <div className="App">
            <form>
                <label>Enter IDX</label>
                <input value={idx} onChange={e => setidx(e.target.value)} />
                <button>Submit</button>
            </form>
            <h3>Indexes I Have Seen</h3>
            {seenIndexes.map(idx => idx).join(",")}
            <h3>Calculated Values</h3>
            {Object.entries(values).map(([key, val], idx) => <div>For Index {key} value is {val}</div>)}
        </div>
    );
}

export default ShowData;
