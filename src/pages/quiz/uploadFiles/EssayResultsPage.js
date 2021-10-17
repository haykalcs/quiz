import { Avatar, Box, Button, CardHeader, Chip } from "@material-ui/core";
import MaterialTable from "material-table";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { useLocation } from "react-router-dom";
import apiQuiz from "../../../actions/quiz/quiz";
import Layout from "../../../components/Layout";
import { saveAs } from "file-saver";
import sortByDate from "../../../config/sortByDate";
import moment from "moment";
import NotSubmittedTable from "../../../components/NotSubmittedTable";

const EssayResultsPage = () => {
  const history = useHistory();
  const location = useLocation();
  const [result, setResult] = useState([]);
  const slug = location.state.slug;
  const [isLoading, setLoading] = useState(true);
  const saveFile = (doc) => {
    saveAs(`https://quizapi.vieproject.xyz/assets/files/quiz/${doc}`, doc);
  };
  const columns = [
    {
      title: "Absen",
      field: "number",
      editable: false,
      width: "1%",
      render: (rowData) => {
        return (
          rowData.number === "" ||
          (rowData.number == null ? (
            <Chip variant="default" color="secondary" label="Absen Kosong" />
          ) : (
            rowData.number
          ))
        );
      },
    },
    {
      title: "Email",
      field: "email",
      editable: false,
    },
    {
      title: "Name",
      render: (rowData) => {
        return (
          <CardHeader
            style={{ padding: 0 }}
            avatar={
              <Avatar
                src={
                  rowData.avatar === "" || rowData.avatar === null
                    ? ""
                    : `https://quizapi.vieproject.xyz/assets/images/avatar/${rowData.avatar}`
                }
                aria-label="recipe"
              />
            }
            title={rowData.name}
          />
        );
      },
      editable: false,
    },
    {
      title: "Score",
      width: "1%",
      field: `results[0].score`,
      render: (rowData) => {
        return rowData.results
          .sort(sortByDate)
          .slice(0, 1)
          .map((item) => item.score);
      },
    },
    {
      title: "Komentar",
      width: "1%",
      render: (rowData) => {
        return (
          <p>
            {rowData.results
              .sort(sortByDate)
              .slice(0, 1)
              .map((item) =>
                item.result_essays
                  .sort(sortByDate)
                  .slice(0, 1)
                  .map((item) => item.comment)
              )}
          </p>
        );
      },
    },
    {
      title: "File",
      width: "1%",
      render: (rowData) => {
        return (
          <Button
            onClick={() =>
              saveFile(
                rowData.results
                  .sort(sortByDate)
                  .slice(0, 1)
                  .map((item) =>
                    item.result_essays
                      .sort(sortByDate)
                      .slice(0, 1)
                      .map((item) => item.file)
                  )
              )
            }
            color="primary"
          >
            {rowData.results
              .sort(sortByDate)
              .slice(0, 1)
              .map((item) =>
                item.result_essays
                  .sort(sortByDate)
                  .slice(0, 1)
                  .map((item) => item.file)
              )}
          </Button>
        );
      },
    },
    {
      title: "Tanggal Submit",
      render: (rowData) => {
        return moment(rowData.results[0].created_at).format("l");
      },
    },
  ];

  const handleRowUpdate = (newData, oldData, resolve) => {
    const formData = new FormData();
    formData.append("_method", "put");
    formData.append("score", newData.results[0].score);
    apiQuiz
      .guruScoreEssay(formData, newData.results[0].result_essays[0].result_id)
      .then((response) => {
        const updateScore = [...result];
        const index = oldData.tableData.id;
        updateScore[index] = newData;
        setResult([...updateScore]);
        console.log(response);
        resolve();
      })
      .catch((error) => {
        console.log(error);
        resolve();
      });
  };

  useEffect(() => {
    if (!location.state) history.push("/quiz");
    apiQuiz
      .resultQuiz(slug, "essay")
      .then((response) => {
        const res = response.data.data;
        console.log(res);
        setLoading(false);
        setResult(res);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [history, location, slug]);

  return !location.state ? (
    <h1>Forbidden</h1>
  ) : (
    <Box>
      <NotSubmittedTable
        slug={slug}
        setLoading={setLoading}
        isLoading={isLoading}
      />
      <MaterialTable
        style={{ padding: "0 20px" }}
        title="Submitted"
        isLoading={isLoading}
        columns={columns}
        data={result}
        options={{
          search: true,
          sorting: true,
          tableLayout: "auto",
          actionsColumnIndex: -1,
          addRowPosition: "first",
        }}
        editable={{
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve) => {
              handleRowUpdate(newData, oldData, resolve);
            }),
        }}
      />
    </Box>
  );
};

export default Layout(EssayResultsPage, "Esai");
