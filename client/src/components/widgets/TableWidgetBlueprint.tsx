import React, { useContext, useEffect, useState } from "react";
import {
    IconButton,
    makeStyles,
    Table, TableBody,
    TableCell, TableContainer,
    TableHead,
    TableRow,
} from "@material-ui/core";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import axios from "axios";

import WidgetContainer from "../common/WidgetContainer";
import WidgetTitleBar from "../common/WidgetTitleBar";
import WidgetBody from "../common/WidgetBody";
import WidgetLoading from "../common/WidgetLoading";
import WidgetError from "../common/WidgetError";

import { ServiceStatusWidgetBuilder } from "../../models/widgetBuilders/ServiceStatusWidgetBuilder";
import { kStore } from "../../utils/constants";
import { TabManagerContext } from "../../utils/contexts/TabManagerContext";
import {TableWidgetBuilder} from "../../models/widgetBuilders/TableWidgetBuilder";
import {log} from "util";
import {RefreshRounded} from "@material-ui/icons";


/**
 * Structure of incoming data from the backend.
 * */
interface TableDataDetails {
    Title: string,
    Status: string,
}


interface TableDataWidgetProps {
    builder: TableWidgetBuilder;
    title: string;
    src: string;
    appURL: string;
}


const TableDataWidgetBlueprint: React.FC<TableDataWidgetProps> = ({ builder, title, src, appURL }) => {

    const classes = useStyles();
    const { removeWidgetFromCurrentTab } = useContext(TabManagerContext);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [tableData, setTableData] = useState<any[]>([]);
    const [refresh, setRefresh] = useState<boolean>(false);


/*    useEffect(() => {
        fetchQuery().catch((err) => setError("An error occurred. Failed to fetch data from backend server."));
    }, [refresh]);

    const fetchQuery = async () => {
        console.log(src)
        const data = (await axios.get(`${src}`));
        console.log("from TableWidgetBlueprint")
        console.log(data)
        if (data.status === 200) {
            console.log(Object.keys(data.data.data[0]));
            setTableData(data.data.data);
        } else {
            console.log("query error")
            throw new Error("Backend query error.");
        }
        setLoading(false);
    };*/

    useEffect(() => {
        const fetchData = async () => {
            const data = (await axios.get(`${src}`));
            console.log("from TableWidgetBlueprint")
            console.log(data)
            if (data.status === 200) {
                console.log(Object.keys(data.data.data[0]));
                setTableData(data.data.data);
            } else {
                console.log("query error")
                throw new Error("Backend query error.");
            }
            setLoading(false);
        }
        fetchData().catch((err) => setError("An error occurred. Failed to fetch data from backend server."));
    }, [refresh]);


    const removeWidget = () => removeWidgetFromCurrentTab(builder.widgetId);

    // const countOk = () => tableData.reduce((ok, data) => data.Status === "Ok" ? ok + 1 : ok, 0);


    if (error) return <WidgetError message={error} onClose={removeWidget}/>;

    if (loading) return <WidgetLoading onClose={removeWidget}/>;

    return (
        <WidgetContainer>
            <WidgetTitleBar title={title} onClose={removeWidget}>
                <IconButton href={appURL} target={"_blank"} color={"inherit"} size={"small"}>
                    <ExitToAppIcon fontSize={"small"}/>
                </IconButton>
                <IconButton style={{color:"white"}} onClick={()=> {
                    setRefresh(!refresh)
                    setLoading(true)
                }}>
                    <RefreshRounded></RefreshRounded>
                </IconButton>
            </WidgetTitleBar>

            <WidgetBody>

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {Object.keys(tableData[0]).map((key, index) => {
                                    return (
                                        <TableCell key={index}>
                                            {key.toUpperCase()}
                                        </TableCell>
                                    )
                                })}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {tableData.map(
                            (data, index) => {
                                return (
                                    <TableRow key={index}>
                                        {Object.values(data).map((key:any) => {
                                            return (<TableCell key={key}>
                                                {key}
                                            </TableCell>)
                                        })}
                                    </TableRow>
                                );
                            }
                        )}
                        </TableBody>

                    </Table>
                </TableContainer>

            </WidgetBody>

        </WidgetContainer>
    );

};


const useStyles = makeStyles(
    (theme) => (
        {
            cellOk: {
                color: theme.palette.success.dark,
                fontWeight: "bold"
            },
            cellNotOk: {
                color: theme.palette.error.main,
            },
            rowOk: {
                cursor: "pointer",
            },
            rowNotOk: {
                // backgroundColor: theme.palette.error.light,
                cursor: "pointer",
                "&:hover": {
                    // backgroundColor: theme.palette.error.main,
                }
            }
        }
    )
);


export default TableDataWidgetBlueprint;
