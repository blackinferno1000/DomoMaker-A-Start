"use strict";

var handleDomo = function handleDomo(e) {
  e.preventDefault();
  $("domoMessage").animate({
    width: 'hide'
  }, 350);

  if ($("domoName").val() == '' || $("domoAge").val() == '' || $("#domoPers").val() == '') {
    handleError("RAWR! All fields are required");
    return false;
  }

  sendAjax('POST', $("domoForm").attr("action"), $("#domoForm").serialize(), function () {
    loadDomosFromServer();
  });
  return false;
};

var handleEditDomo = function handleEditDomo(e) {
  e.preventDefault();
  $("domoMessage").animate({
    width: 'hide'
  }, 350);

  if ($("editDomoName").val() == '' || $("editDomoAge").val() == '' || $("#editDomoPers").val() == '') {
    handleError("RAWR! All fields are required");
    return false;
  }

  sendAjax('POST', $("editDomoForm").attr("action"), $("#editDomoForm").serialize(), function () {
    loadDomosFromServer();
  });
  return false;
};

var DomoForm = function DomoForm(props) {
  return (/*#__PURE__*/React.createElement("form", {
      id: "domoForm",
      name: "domoForm",
      onSubmit: handleDomo,
      action: "/maker",
      method: "POST",
      className: "domoForm"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: "name"
    }, "Name: "), /*#__PURE__*/React.createElement("input", {
      id: "domoName",
      type: "text",
      name: "name",
      placeholder: "Domo Name"
    }), /*#__PURE__*/React.createElement("label", {
      htmlFor: "age"
    }, "Age: "), /*#__PURE__*/React.createElement("input", {
      id: "domoAge",
      type: "text",
      name: "age",
      placeholder: "Domo Age"
    }), /*#__PURE__*/React.createElement("label", {
      htmlFor: "personality"
    }, "Personality: "), /*#__PURE__*/React.createElement("input", {
      id: "domoPers",
      type: "text",
      name: "personality",
      placeholder: "Domo Personality"
    }), /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "_csrf",
      value: props.csrf
    }), /*#__PURE__*/React.createElement("input", {
      className: "makeDomoSubmit",
      type: "submit",
      value: "Make Domo"
    }))
  );
};

var EditDomoForm = function EditDomoForm(props) {
  return (/*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", null, "Edit selected domo"), /*#__PURE__*/React.createElement("form", {
      id: "editDomoForm",
      name: "editDomoForm",
      onSubmit: handleEditDomo,
      action: "/editDomo",
      method: "POST",
      className: "domoForm"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: "name"
    }, "Name: "), /*#__PURE__*/React.createElement("input", {
      id: "editDomoName",
      type: "text",
      name: "name",
      placeholder: ""
    }), /*#__PURE__*/React.createElement("label", {
      htmlFor: "age"
    }, "Age: "), /*#__PURE__*/React.createElement("input", {
      id: "editDomoAge",
      type: "text",
      name: "age",
      placeholder: ""
    }), /*#__PURE__*/React.createElement("label", {
      htmlFor: "personality"
    }, "Personality: "), /*#__PURE__*/React.createElement("input", {
      id: "editDomoPers",
      type: "text",
      name: "personality",
      placeholder: ""
    }), /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "_csrf",
      value: props.csrf
    }), /*#__PURE__*/React.createElement("input", {
      id: "editDomoID",
      type: "hidden",
      name: "id",
      value: ""
    }), /*#__PURE__*/React.createElement("input", {
      className: "makeDomoSubmit",
      type: "submit",
      value: "Make Domo"
    })))
  );
};

var edit = function edit(domo, csrf) {
  console.log(domo);
  $("#editDomo").css({
    "display": "inline-block"
  });
  $("#editDomoName").val(domo.name);
  $("#editDomoAge").val(domo.age);
  $("#editDomoPers").val(domo.personality);
  $("#editDomoID").val(domo._id);
};

var DomoList = function DomoList(props) {
  if (props.domos.length === 0) {
    return (/*#__PURE__*/React.createElement("div", {
        className: "domoList"
      }, /*#__PURE__*/React.createElement("h3", {
        className: "emptyDomo"
      }, "No Domos yet"))
    );
  }

  var domoNodes = props.domos.map(function (domo) {
    return (/*#__PURE__*/React.createElement("div", {
        key: domo._id,
        className: "domo",
        onClick: edit.bind(this, domo, props.csrf)
      }, /*#__PURE__*/React.createElement("img", {
        src: "/assets/img/domoface.jpeg",
        alt: " domo face",
        className: "domoFace"
      }), /*#__PURE__*/React.createElement("h3", {
        className: "domoName"
      }, " Name: ", domo.name), /*#__PURE__*/React.createElement("h3", {
        className: "domoAge"
      }, "Age: ", domo.age), /*#__PURE__*/React.createElement("h3", {
        className: "domoPersonality"
      }, "Personality: ", domo.personality))
    );
  });
  return (/*#__PURE__*/React.createElement("div", {
      className: "domoList"
    }, domoNodes)
  );
};

var loadDomosFromServer = function loadDomosFromServer() {
  sendAjax('GET', '/getDomos', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(DomoList, {
      domos: data.domos
    }), document.querySelector("#domos"));
  });
};

var setup = function setup(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(DomoForm, {
    csrf: csrf
  }), document.querySelector("#makeDomo"));
  ReactDOM.render( /*#__PURE__*/React.createElement(EditDomoForm, {
    csrf: csrf
  }), document.querySelector("#editDomo"));
  $("#editDomo").css({
    "display": "none"
  });
  ReactDOM.render( /*#__PURE__*/React.createElement(DomoList, {
    domos: [],
    csrf: csrf
  }), document.querySelector("#domos"));
  loadDomosFromServer();
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
"use strict";

var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $("#domoMessage").animate({
    width: 'toggle'
  }, 350);
};

var redirect = function redirect(res) {
  $("#domoMessage").animate({
    width: 'hide'
  }, 350);
  window.location = res.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
