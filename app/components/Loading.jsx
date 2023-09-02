import React from "react";
import { Spinner } from "@material-tailwind/react";

const Loading = () => {
    return (
        <>
            <div
                role="status"
                className="flex justify-center items-center p-36"
            >
                <Spinner className="h-12 w-12" />

                <span className="sr-only">Loading...</span>
            </div>
        </>
    );
};

export default Loading;
