import { Typography } from "@material-tailwind/react";

export function Footer() {
  return (
    <footer className="w-full bg-white p-4 flex flex-col items-center bottom-0 left-0 right-0">
      <div className="flex flex-row flex-wrap items-center justify-between gap-y-6 gap-x-12 bg-white text-center w-full">
        <div className="flex items-center">
          <img 
            src="https://docs.material-tailwind.com/img/logo-ct-dark.png" 
            alt="logo-ct" 
            className="w-10" 
          />
        </div>
        <div className="flex items-center">
          <ul className="flex flex-wrap items-center gap-y-2 gap-x-8">
            <li>
              <Typography
                as="a"
                href="//localhost:8000/docs"
                color="blue-gray"
                className="font-normal transition-colors hover:text-blue-500 focus:text-blue-500"
              >
                Api Docs
              </Typography>
            </li>
          </ul>
        </div>
      </div>
      <hr className="my-8 border-blue-gray-50 w-full" />
      <Typography color="blue-gray" className="text-center font-normal w-full">
        &copy; 2023 Material Tailwind. All Rights Reserved.
      </Typography>
    </footer>
  );
}
