const handleDomo = (e) => {
    e.preventDefault();

    $("domoMessage").animate({width:'hide'}, 350);

    if($("domoName").val() == '' || $("domoAge").val() == '' || $("#domoPers").val() == '') {
        handleError("RAWR! All fields are required");
        return false;
    }

    sendAjax('POST', $("domoForm").attr("action"), $("#domoForm").serialize(), function() {
        loadDomosFromServer();
    });

    return false;
};

const handleEditDomo = (e) => {
    e.preventDefault();

    $("domoMessage").animate({width:'hide'}, 350);

    if($("editDomoName").val() == '' || $("editDomoAge").val() == '' || $("#editDomoPers").val() == '') {
        handleError("RAWR! All fields are required");
        return false;
    }

    sendAjax('POST', $("editDomoForm").attr("action"), $("#editDomoForm").serialize(), function() {
        loadDomosFromServer();
    });

    return false;
};

const DomoForm = (props) => {
    return (
        <form id="domoForm" 
            name="domoForm"
            onSubmit={handleDomo}
            action="/maker"
            method="POST"
            className="domoForm"
        >  
            <label htmlFor="name">Name: </label>
            <input id="domoName" type="text" name="name" placeholder="Domo Name"/>
            <label htmlFor="age">Age: </label>
            <input id="domoAge" type="text" name="age" placeholder="Domo Age"/>
            <label htmlFor="personality">Personality: </label>
            <input id="domoPers" type="text" name="personality" placeholder="Domo Personality"/>
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <input className="makeDomoSubmit" type="submit" value="Make Domo"/>
        </form>
    );
};

const EditDomoForm = (props) => {
    return (
        <div>
            <h2>Edit selected domo</h2>
            <form id="editDomoForm" 
                name="editDomoForm"
                onSubmit={handleEditDomo}
                action="/editDomo"
                method="POST"
                className="domoForm"
            >  
                <label htmlFor="name">Name: </label>
                <input id="editDomoName" type="text" name="name" placeholder=""/>
                <label htmlFor="age">Age: </label>
                <input id="editDomoAge" type="text" name="age" placeholder=""/>
                <label htmlFor="personality">Personality: </label>
                <input id="editDomoPers" type="text" name="personality" placeholder=""/>
                <input type="hidden" name="_csrf" value={props.csrf}/>
                <input id="editDomoID" type="hidden" name="id" value=""/>
                <input className="makeDomoSubmit" type="submit" value="Make Domo"/>
            </form>
        </div>
    );
};

const edit = (domo, csrf) => {
    console.log(domo);
    $("#editDomo").css({"display": "inline-block"});

    $("#editDomoName").val(domo.name);
    $("#editDomoAge").val(domo.age);
    $("#editDomoPers").val(domo.personality);
    $("#editDomoID").val(domo._id);
};

const DomoList = function(props) {
    if(props.domos.length === 0) {
        return (
            <div className="domoList">
                <h3 className="emptyDomo">No Domos yet</h3>
            </div>
        );
    }

    const domoNodes = props.domos.map(function(domo) {
        return (
            <div key={domo._id} className="domo" onClick={edit.bind(this, domo, props.csrf)}>
                <img src="/assets/img/domoface.jpeg" alt=" domo face" className="domoFace" />
                <h3 className="domoName"> Name: {domo.name}</h3>
                <h3 className="domoAge">Age: {domo.age}</h3>
                <h3 className="domoPersonality">Personality: {domo.personality}</h3>
            </div>
        );
    });

    return (
        <div className="domoList">
            {domoNodes}
        </div>
    );
};

const loadDomosFromServer = () => {
    sendAjax('GET', '/getDomos', null, (data) => {
        ReactDOM.render(
            <DomoList domos={data.domos} />, 
            document.querySelector("#domos")
        );
    });
};

const setup = function(csrf) {
    ReactDOM.render(
        <DomoForm csrf={csrf} />,
        document.querySelector("#makeDomo")
    );

    ReactDOM.render(
        <EditDomoForm csrf={csrf} />,
        document.querySelector("#editDomo")
    );

    $("#editDomo").css({"display": "none"});

    ReactDOM.render(
        <DomoList domos= {[]} csrf={csrf} />,
        document.querySelector("#domos")
    );

    loadDomosFromServer();
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});

