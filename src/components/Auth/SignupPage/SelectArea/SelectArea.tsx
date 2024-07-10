'use client';

import { useState } from 'react';
import { areaData } from './areaData';

function SelectArea() {
  const [selectedArea, setSelectedArea] = useState<string | null>(null);

  const handleSelectArea = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    setSelectedArea(event.target.value);
  };

  return (
    <div className="flex flex-col items-center w-80">
      <h5 className="text-sm  text-slate-700 my-2">거주지를 선택해주세요!</h5>
      <div className="flex justify-center gap-5">
        <select className="w-24" name="area" id="" onChange={handleSelectArea}>
          <option className="hidden" key={'지역'} value={''}>
            지역
          </option>
          {areaData.map((area) => {
            return (
              <option key={area.name} value={area.name}>
                {area.name}
              </option>
            );
          })}
        </select>
        <select className="w-24" name="subArea" id="">
          <option className="hidden" key={'시/군/구'} value={''}>
            시/군/구
          </option>
          {areaData
            .find((area) => {
              return area.name === selectedArea;
            })
            ?.subArea.map((sub) => {
              return (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              );
            })}
        </select>
      </div>
    </div>
  );
}

export default SelectArea;
