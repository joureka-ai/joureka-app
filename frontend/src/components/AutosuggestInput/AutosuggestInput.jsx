import React, {useState} from 'react';
import Autosuggest from 'react-autosuggest';

const AutoSuggestInput = ({suggestionsList, value, setValue}) => {
    const [suggestions, setSuggestions] = useState([]);

    const onChange = (event, { newValue }) => {
        setValue(newValue)
    };

    const onSuggestionsFetchRequested = ({ value }) => {
        setSuggestions(getSuggestions(value))
    };

    const onSuggestionsClearRequested = () => {
        setSuggestions([]);
    };

    const shouldRenderSuggestions = (value, reason)=> {
        return value.trim().length >= 0;
    }

    const getSuggestions = (value) => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;
      
        return inputLength === 0 ? suggestionsList : suggestionsList.filter(lang =>
          lang.toLowerCase().slice(0, inputLength) === inputValue
        );
    };
      

    const getSuggestionValue = (suggestion) => {
        return suggestion;
    }
      
      const renderSuggestion = (suggestion) => {
          return (
            <div>
            {suggestion}
            </div>
          )
        };

    const inputProps = {
        placeholder: 'Gebe einen Titel ein oder wähle einen vorhandenen Titel aus.',
        value,
        onChange: onChange,
    };

    return (
    <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        shouldRenderSuggestions={shouldRenderSuggestions}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
    />
    );

}

export default AutoSuggestInput;