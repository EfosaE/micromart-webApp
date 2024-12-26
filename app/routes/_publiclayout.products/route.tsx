import { useFetcher } from '@remix-run/react';
import { useState } from 'react';

const Products = () => {
  const [file, setFile] = useState<File | null>(null);
  const fetcher = useFetcher();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  return (
    <div>
      <p>Products</p>

      <fetcher.Form
        method='post'
        action='/create-product'
        encType='multipart/form-data'>
        <label htmlFor='file'>Choose a file:</label>
        <input
          type='file'
          id='file'
          name='file'
          accept='image/*'
          required
          onChange={handleFileChange}
        />

        <br />
        <br />

        <button
          type='submit'
          className='text-white bg-secondary p-3 text-center'>
          Upload
        </button>
      </fetcher.Form>

      {file && <p>Selected file: {file.name}</p>}


      {fetcher.state === 'submitting' && (
        <p className='text-blue-500'>Uploading...</p>
      )}
    </div>
  );
};

export default Products;
