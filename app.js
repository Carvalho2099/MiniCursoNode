import tabela2024 from "./tabela.js";
import express from "express";
import { modeloAtualizacaoTime, modeloTime } from "./validacao.js";

const app = express();
app.use(express.json());

app.get("/", (req, resp) => {
  resp.status(200).send(tabela2024);
});

app.get("/:sigla", (req, resp) => {
  const sigla = req.params.sigla.toUpperCase();
  const time = tabela2024.find((x) => x.sigla === sigla);
  if (!time) {
    resp.status(404).send("Time inexistente.");
    return;
  }

  resp.status(200).send(time);
});

app.put("/:sigla", (req, resp) => {
  const sigla = req.params.sigla.toUpperCase();
  const timeSelecionado = tabela2024.find((x) => x.sigla === sigla);
  if (!timeSelecionado) {
    resp.status(404).send("Time não encotrado!");
    return;
  }
  const { error } = modeloAtualizacaoTime.validate(req.body);
  if (error) {
    resp.status(400).send(error);
    return;
  }
  const campos = Object.keys(req.body);
  for (let campo of campos) {
    timeSelecionado[campo] = req.body[campo];
  }
  req.status(200).send(timeSelecionado);
});

app.post("/", (req, resp) => {
  const novoTime = req.body;
  const { error } = modeloTime.validate(novoTime);
  if (error) {
    resp.status(400).send(error);
    return;
  }
  tabela2024.push(novoTime);
  resp.status(200).send(novoTime);
});

app.delete("/:sigla", (req, resp) => {
  const sigla = req.params.sigla.toUpperCase();
  const indiceTImeSelecionado = tabela2024.findIndex((x) => x.sigla === sigla);
  if (indiceTImeSelecionado === -1) {
    resp.status(404).send("Time não encotrado!");
    return;
  }
  const timeRemovido = tabela2024.splice(indiceTImeSelecionado, 1);
  resp.status(200).send(timeRemovido);
});

app.listen(300, () => console.log("server running"));
