import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';

import Header from '../../components/Header';
import FileList from '../../components/FileList';
import Upload from '../../components/Upload';

import { Container, Title, ImportFileContainer, Footer } from './styles';

import alert from '../../assets/alert.svg';
import api from '../../services/api';

interface FileProps {
  file: File;
  name: string;
  readableSize: string;
}

const Import: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileProps[]>([]);
  const history = useHistory();

  async function handleUpload(): Promise<void> {
    const data = new FormData();

    /**
     * TODO: - Avaliar se é necessário enviar multiplos arquivos, pois
     * backend aceita 1 por vez: single.
     */
    data.append('file', uploadedFiles[0].file);

    try {
      // await api.post('/transactions/import', data);
      await api.post('transactions/import', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      history.push('/');
    } catch (err) {
      console.log(err.response.error);
    }
  }

  function submitFile(files: File[]): void {
    const filesList = files.map(file => {
      return {
        file,
        name: file.name,
        readableSize: String(file.size),
      };
    });

    setUploadedFiles(filesList);
  }

  // async function handleUpload(files: File[]): Promise<void> {
  //   const file = files.length > 0 ? files[0] : null;

  //   if (file) {
  //     const formData = new FormData();
  //     formData.append('file', file);

  //     const res = await api.post('transactions/import', formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     });

  //     const transactionsData = res.data.map((tx: any) => {
  //       return {
  //         ...tx,
  //         value: formatValue(tx.value),
  //         createdAtFormatted: format(parseISO(tx.created_at), 'dd/MM/yyyy', {}),
  //       };
  //     });

  //     setTransactions([...transactions, ...transactionsData]);
  //   }
  // }

  return (
    <>
      <Header size="small" />
      <Container>
        <Title>Importar uma transação</Title>

        <br />
        <Link to="/">Voltar Dashboard</Link>

        <ImportFileContainer>
          <Upload onUpload={submitFile} />
          {!!uploadedFiles.length && <FileList files={uploadedFiles} />}

          <Footer>
            <p>
              <img src={alert} alt="Alert" />
              Permitido apenas arquivos CSV
            </p>
            <button onClick={handleUpload} type="button">
              Enviar
            </button>
          </Footer>
        </ImportFileContainer>
      </Container>
    </>
  );
};

export default Import;
