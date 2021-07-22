export const serialXML = 
`<DieCutLabel Version="8.0" Units="twips">
<PaperOrientation>Landscape</PaperOrientation>
<Id>Small30346</Id>
<IsOutlined>false</IsOutlined>
<PaperName>30346 1/2 in x 1-7/8 in</PaperName>
<DrawCommands>
    <RoundRectangle X="0" Y="0" Width="720" Height="2700" Rx="180" Ry="180"/>
</DrawCommands>
<ObjectInfo>
    <BarcodeObject>
        <Name>BARCODE</Name>
        <ForeColor Alpha="255" Red="0" Green="0" Blue="0"/>
        <BackColor Alpha="0" Red="255" Green="255" Blue="255"/>
        <LinkedObjectName/>
        <Rotation>Rotation0</Rotation>
        <IsMirrored>False</IsMirrored>
        <IsVariable>True</IsVariable>
        <Text></Text>
        <Type>Code39</Type>
        <Size>Medium</Size>
        <TextPosition>Bottom</TextPosition>
        <TextFont Family="Arial" Size="8" Bold="False" Italic="False" Underline="False" Strikeout="False"/>
        <CheckSumFont Family="Arial" Size="8" Bold="False" Italic="False" Underline="False" Strikeout="False"/>
        <TextEmbedding>None</TextEmbedding>
        <ECLevel>0</ECLevel>
        <HorizontalAlignment>Center</HorizontalAlignment>
        <QuietZonesPadding Left="0" Top="0" Right="0" Bottom="0"/>
    </BarcodeObject>
    <Bounds X="326" Y="57" Width="2080" Height="581"/>
</ObjectInfo>
</DieCutLabel>
`;


export const serialMeshXML = (mesh) =>{

    return(
`<DieCutLabel Version="8.0" Units="twips">
	<PaperOrientation>Landscape</PaperOrientation>
	<Id>Small30346</Id>
	<IsOutlined>false</IsOutlined>
	<PaperName>30346 1/2 in x 1-7/8 in</PaperName>
	<DrawCommands>
		<RoundRectangle X="0" Y="0" Width="720" Height="2700" Rx="180" Ry="180"/>
	</DrawCommands>
	<ObjectInfo>
		<TextObject>
			<Name>MESH_TEXT</Name>
			<ForeColor Alpha="255" Red="0" Green="0" Blue="0"/>
			<BackColor Alpha="0" Red="255" Green="255" Blue="255"/>
			<LinkedObjectName/>
			<Rotation>Rotation0</Rotation>
			<IsMirrored>False</IsMirrored>
			<IsVariable>True</IsVariable>
			<HorizontalAlignment>Right</HorizontalAlignment>
			<VerticalAlignment>Middle</VerticalAlignment>
			<TextFitMode>None</TextFitMode>
			<UseFullFontHeight>True</UseFullFontHeight>
			<Verticalized>False</Verticalized>
			<StyledText>
				<Element>
					<String xml:space="preserve">Mesh:</String>
					<Attributes>
						<Font Family="Arial" Size="8" Bold="False" Italic="False" Underline="False" Strikeout="False"/>
						<ForeColor Alpha="255" Red="0" Green="0" Blue="0" HueScale="100"/>
					</Attributes>
				</Element>
			</StyledText>
		</TextObject>
		<Bounds X="326" Y="236.535401943511" Width="460" Height="251.464598056489"/>
	</ObjectInfo>
	<ObjectInfo>
		<TextObject>
			<Name>MESH_FIELD</Name>
			<ForeColor Alpha="255" Red="0" Green="0" Blue="0"/>
			<BackColor Alpha="0" Red="255" Green="255" Blue="255"/>
			<LinkedObjectName/>
			<Rotation>Rotation0</Rotation>
			<IsMirrored>False</IsMirrored>
			<IsVariable>True</IsVariable>
			<HorizontalAlignment>Left</HorizontalAlignment>
			<VerticalAlignment>Middle</VerticalAlignment>
			<TextFitMode>None</TextFitMode>
			<UseFullFontHeight>True</UseFullFontHeight>
			<Verticalized>False</Verticalized>
			<StyledText>
				<Element>
					<String xml:space="preserve">${mesh}</String>
					<Attributes>
						<Font Family="Arial" Size="8" Bold="False" Italic="False" Underline="False" Strikeout="False"/>
						<ForeColor Alpha="255" Red="0" Green="0" Blue="0" HueScale="100"/>
					</Attributes>
				</Element>
			</StyledText>
		</TextObject>
		<Bounds X="896" Y="236.535401943511" Width="1720" Height="251"/>
	</ObjectInfo>
</DieCutLabel>
`);
};


export const serialBluetoothMeshXML = (mesh, bluetooth) => {
	return `
		
<DieCutLabel>
<PaperOrientation>Landscape</PaperOrientation>
<Id>Small30346</Id>
<IsOutlined>false</IsOutlined>
<PaperName>30346 1/2 in x 1-7/8 in</PaperName>
<DrawCommands>
	<RoundRectangle X="0" Y="0" Width="720" Height="2700" Rx="180" Ry="180"/>
</DrawCommands>
<ObjectInfo>
	<TextObject>
		<Name>TEXT</Name>
		<ForeColor Alpha="255" Red="0" Green="0" Blue="0"/>
		<BackColor Alpha="0" Red="255" Green="255" Blue="255"/>
		<LinkedObjectName/>
		<Rotation>Rotation0</Rotation>
		<IsMirrored>False</IsMirrored>
		<IsVariable>True</IsVariable>
		<HorizontalAlignment>Left</HorizontalAlignment>
		<VerticalAlignment>Middle</VerticalAlignment>
		<TextFitMode>None</TextFitMode>
		<UseFullFontHeight>True</UseFullFontHeight>
		<Verticalized>False</Verticalized>
		<StyledText>
			<Element>
				<String xml:space="preserve">Mesh</String>
				<Attributes>
					<Font Family="Arial" Size="8" Bold="False" Italic="False" Underline="False" Strikeout="False"/>
					<ForeColor Alpha="255" Red="0" Green="0" Blue="0" HueScale="100"/>
				</Attributes>
			</Element>
		</StyledText>
	</TextObject>
	<Bounds X="326" Y="121.767700971755" Width="580" Height="251.464598056489"/>
</ObjectInfo>
<ObjectInfo>
	<TextObject>
		<Name>TEXT_1</Name>
		<ForeColor Alpha="255" Red="0" Green="0" Blue="0"/>
		<BackColor Alpha="0" Red="255" Green="255" Blue="255"/>
		<LinkedObjectName/>
		<Rotation>Rotation0</Rotation>
		<IsMirrored>False</IsMirrored>
		<IsVariable>True</IsVariable>
		<HorizontalAlignment>Center</HorizontalAlignment>
		<VerticalAlignment>Middle</VerticalAlignment>
		<TextFitMode>None</TextFitMode>
		<UseFullFontHeight>True</UseFullFontHeight>
		<Verticalized>False</Verticalized>
		<StyledText>
			<Element>
				<String xml:space="preserve">BT</String>
				<Attributes>
					<Font Family="Arial" Size="8" Bold="False" Italic="False" Underline="False" Strikeout="False"/>
					<ForeColor Alpha="255" Red="0" Green="0" Blue="0" HueScale="100"/>
				</Attributes>
			</Element>
		</StyledText>
	</TextObject>
	<Bounds X="326" Y="386.535401943511" Width="475" Height="251.464598056489"/>
</ObjectInfo>
<ObjectInfo>
	<TextObject>
		<Name>TEXT_2</Name>
		<ForeColor Alpha="255" Red="0" Green="0" Blue="0"/>
		<BackColor Alpha="0" Red="255" Green="255" Blue="255"/>
		<LinkedObjectName/>
		<Rotation>Rotation0</Rotation>
		<IsMirrored>False</IsMirrored>
		<IsVariable>False</IsVariable>
		<HorizontalAlignment>Left</HorizontalAlignment>
		<VerticalAlignment>Top</VerticalAlignment>
		<TextFitMode>None</TextFitMode>
		<UseFullFontHeight>True</UseFullFontHeight>
		<Verticalized>False</Verticalized>
		<StyledText>
			<Element>
				<String xml:space="preserve">${mesh}</String>
				<Attributes>
					<Font Family="Arial" Size="8" Bold="False" Italic="False" Underline="False" Strikeout="False"/>
					<ForeColor Alpha="255" Red="0" Green="0" Blue="0" HueScale="100"/>
				</Attributes>
			</Element>
		</StyledText>
	</TextObject>
	<Bounds X="801" Y="147" Width="1815" Height="251"/>
</ObjectInfo>
<ObjectInfo>
	<TextObject>
		<Name>TEXT__1</Name>
		<ForeColor Alpha="255" Red="0" Green="0" Blue="0"/>
		<BackColor Alpha="0" Red="255" Green="255" Blue="255"/>
		<LinkedObjectName/>
		<Rotation>Rotation0</Rotation>
		<IsMirrored>False</IsMirrored>
		<IsVariable>False</IsVariable>
		<HorizontalAlignment>Left</HorizontalAlignment>
		<VerticalAlignment>Top</VerticalAlignment>
		<TextFitMode>None</TextFitMode>
		<UseFullFontHeight>True</UseFullFontHeight>
		<Verticalized>False</Verticalized>
		<StyledText>
			<Element>
				<String xml:space="preserve">${bluetooth}</String>
				<Attributes>
					<Font Family="Arial" Size="8" Bold="False" Italic="False" Underline="False" Strikeout="False"/>
					<ForeColor Alpha="255" Red="0" Green="0" Blue="0" HueScale="100"/>
				</Attributes>
			</Element>
		</StyledText>
	</TextObject>
	<Bounds X="801" Y="417" Width="1690" Height="206"/>
</ObjectInfo>
</DieCutLabel>
	`;
}



export function getDymoPrinter(dymo)
{
    const printers = dymo.label.framework.getPrinters();

    if(printers.length === 0)
    {
        return null;
    }

    for (let i = 0; i < printers.length; ++i)
    {
        let printer = printers[i];
        if (printer.printerType === "LabelWriterPrinter")
        {
            return printer.name;
            
        }
    }

    return null;
}


export function getDymoLabel(dymo, labelName)
{
    const label = dymo.label.framework.openLabelXml(labelName);

    if(!label)
    {
        return null;
    }

    return label;
}