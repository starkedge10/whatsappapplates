import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTemplates } from "../../redux/templateThunks";

function templateMessagePreview({ templateMessage }) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (templates.length === 0) {
      dispatch(fetchTemplates());
    }
  }, []);

  const { templates, loading, deleteStatus } = useSelector(
    (state) => state.templates
  );

  const template = templates.find(
    (template) => template.name === templateMessage.name
  );

  const replaceVariables = (text, component, parameterFormat) => {
    if (!text || !component.example) return text;

    if (parameterFormat === "POSITIONAL") {
      let values = [];

      if (component.type === "HEADER") {
        const headerValues = component.example?.header_text;
        values = Array.isArray(headerValues[0])
          ? headerValues[0]
          : headerValues;
      } else if (component.type === "BODY") {
        const bodyValues = component.example?.body_text;
        values = Array.isArray(bodyValues[0]) ? bodyValues[0] : bodyValues;
      }

      return text.replace(
        /{{(\d+)}}/g,
        (match, index) => values?.[parseInt(index) - 1] || match
      );
    }

    if (parameterFormat === "NAMED") {
      let namedValues = [];

      // Support both header and body
      if (component.type === "HEADER") {
        namedValues = component.example?.header_text_named_params || [];
      } else if (component.type === "BODY") {
        namedValues = component.example?.body_text_named_params || [];
      }

      return text.replace(/{{(\w+)}}/g, (match, key) => {
        const param = namedValues.find((p) => p.param_name === key);
        return param?.example || match;
      });
    }

    return text;
  };

  if (!template || !template.components) {
    return <p className="text-gray-500 mt-5">Loading template preview...</p>;
  }

  const header = template.components.find((comp) => comp.type === "HEADER");
  const body = template.components.find((comp) => comp.type === "BODY");
  const footer = template.components.find((comp) => comp.type === "FOOTER");
  const buttonComponent = template.components.find(
    (comp) => comp.type === "BUTTONS"
  );
  const buttons = buttonComponent?.buttons || [];

  const renderTextWithNewlines = (text) => {
    return text?.split("\n").map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  return (
    <>
      <div className="">
        {/* Header */}
        {header && header.format === "TEXT" && (
          <h2 className="font-bold text-md mb-2 break-words  ">
            {replaceVariables(header.text, header, template.parameter_format)}
          </h2>
        )}
        {header && header.format === "IMAGE" && (
          <div className=" overflow-hidden mb-2">
            <img
              src={
                header.imagePreview || header.example?.header_handle?.[0] || ""
              }
              alt="Header"
              className="w-full  rounded-sm"
            />
          </div>
        )}

        {/* Body */}
        {body && (
          <p className="mb-2 text-sm text-black break-words">
            {renderTextWithNewlines(
              replaceVariables(body.text, body, template.parameter_format)
            )}
          </p>
        )}

        {/* Footer */}
        {footer && (
          <p className="text-gray-500 text-xs break-words">{footer.text}</p>
        )}

        {/* Buttons */}
        {buttons.length > 0 && (
          <div className="mt-3">
            {buttons.map((btn, index) => {
              if (btn.type === "PHONE_NUMBER") {
                return (
                  <div
                    key={index}
                    className="text-center py-2 border-t-2 border-gray-100"
                  >
                    <a
                      href={`tel:${btn.phone_number}`}
                      className="text-blue-500 font-semibold text-sm py-1 px-2 mt-2 rounded text-center"
                    >
                      <i className="fa-solid fa-phone text-blue-500 text-sm mr-2 font-semibold"></i>
                      {btn.text}
                    </a>
                  </div>
                );
              } else if (btn.type === "URL") {
                return (
                  <div
                    key={index}
                    className="text-center py-2 border-t-2 border-gray-100"
                  >
                    <a
                      href={btn.url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 font-semibold py-1 px-2 mt-2 rounded text-center text-sm"
                    >
                      <i className="fa-solid fa-arrow-up-right-from-square text-blue-500 text-sm mr-2 font-semibold"></i>
                      {btn.text}
                    </a>
                  </div>
                );
              } else {
                return (
                  <div
                    key={index}
                    className="text-center py-2 border-t-2 border-gray-100"
                  >
                    <button className="text-blue-500 font-semibold py-1 px-2 rounded text-sm text-center cursor-pointer">
                      <i className="fa-solid fa-reply text-blue-500 text-sm mr-2 font-semibold"></i>
                      {btn.text}
                    </button>
                  </div>
                );
              }
            })}
          </div>
        )}
      </div>
    </>
  );
}

export default templateMessagePreview;
