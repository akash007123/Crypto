import { PuffLoader } from "react-spinners";

const Loader = ({ isLoading }) =>
  isLoading && (
    <div className="fixed inset-0 flex h-screen w-full items-center justify-center p-4">
      <PuffLoader loading={isLoading} color="#000000" size="60" />
    </div>
  );

export default Loader;
