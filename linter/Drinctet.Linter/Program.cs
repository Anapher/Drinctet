using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Xml;
using HashidsNet;

namespace Drinctet.Linter
{
    public class DrinctetError
    {
        public DrinctetError(int lineNumber, int linePosition, string message, bool isFixed = false)
        {
            LineNumber = lineNumber;
            LinePosition = linePosition;
            Message = message;
            IsFixed = isFixed;
        }

        public int LineNumber { get; set; }
        public int LinePosition { get; set; }
        public string Message { get; set; }
        public bool IsFixed { get; set; }
    }

    class Program
    {
        static void Main(string[] args)
        {
            IEnumerable<DrinctetError> errors;

            var path = args[0];

            var settings = new XmlReaderSettings {ConformanceLevel = ConformanceLevel.Fragment};
            using (var reader = XmlReader.Create(new MemoryStream(File.ReadAllBytes(path)), settings))
            using (var writer = XmlWriter.Create(path, new XmlWriterSettings{OmitXmlDeclaration = false, ConformanceLevel = ConformanceLevel.Fragment, Indent = true, IndentChars = "    "}))
            {
                errors = LintFile(reader, writer);
            }

            foreach (var err in errors)
            {
                Console.WriteLine($"[{(err.IsFixed ? "x" : " ")}] (Line: {err.LineNumber}, pos: {err.LinePosition}): {err.Message}");
            }
        }

        private static IEnumerable<DrinctetError> LintFile(XmlReader xmlReader, XmlWriter xmlWriter)
        {
            var ids = new HashSet<string>();
            var errors = new List<DrinctetError>();

            var knownTags = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
                {"sexual", "socialmedia", "personal", "deep", "hostonly"};

            var info = (IXmlLineInfo) xmlReader;

            void AddError(string message, bool isFixed = false)
            {
                errors.Add(new DrinctetError(info.LineNumber, info.LinePosition, message, isFixed));
            }

            var hashIds = new Hashids("drinctet");
            var random = new Random();

            while (!xmlReader.EOF)
            {
                switch (xmlReader.NodeType)
                {
                    case XmlNodeType.Comment:
                        xmlWriter.WriteComment(xmlReader.Value);
                        break;
                    case XmlNodeType.Element:
                        xmlWriter.WriteStartElement(xmlReader.Name);

                        var id = xmlReader.GetAttribute("id");
                        if (!string.IsNullOrEmpty(id) && !ids.Add(id))
                        {
                            id = null;
                            AddError("Duplicate id found", true);
                        } else if (string.IsNullOrEmpty(id))
                        {
                            id = null;
                            AddError("Id missing", true);
                        }

                        var addedId = false;
                        if (id == null)
                        {
                            for (int i = 1; i < 1000; i++)
                            {
                                id = hashIds.Encode(random.Next(i * 256));
                                if (ids.Add(id))
                                    break;

                                if (i == 999)
                                {
                                    ids.Add(id = Guid.NewGuid().ToString("N"));
                                }
                            }

                            xmlWriter.WriteAttributeString("id", id);
                            addedId = true;
                        }

                        for (int i = 0; i < xmlReader.AttributeCount; i++)
                        {
                            xmlReader.MoveToAttribute(i);

                            switch (xmlReader.Name)
                            {
                                case "id":
                                    if (addedId)
                                        continue;
                                    break;
                                case "willPower":
                                    if (!int.TryParse(xmlReader.Value, out var willPower) || willPower < 1 || willPower > 5)
                                        AddError("WillPower must be a number between 1 and 5.");
                                    break;
                                case "followUpPropability":
                                    if (!float.TryParse(xmlReader.Value, out var followUpPropability) ||
                                        followUpPropability <= 0 || followUpPropability > 1)
                                    {
                                        AddError("followUpPropability must be a number between 0 and one (zero exclusive).");
                                    }
                                    break;
                                case "followUpDelay":
                                    if (!int.TryParse(xmlReader.Value, out var delay) || delay < 0)
                                    {
                                        AddError("folowUpDelay must be a number between 0 and infinity");
                                    }
                                    break;
                                case "tags":
                                    var tags = xmlReader.Value.Split(',');
                                    var unknownTags = tags.Where(x => !knownTags.Contains(x)).ToList();
                                    if (unknownTags.Any())
                                    {
                                        AddError($"The card contains unknown tags: {string.Join(", ", unknownTags)}");
                                    }
                                    break;
                            }

                            xmlWriter.WriteAttributeString(xmlReader.Name, xmlReader.Value);
                        }

                        xmlReader.MoveToElement();

                        var reader = xmlReader.ReadSubtree();
                        reader.Read();
                        reader.Read();
                        while (reader.Read())
                        {
                            xmlWriter.WriteNode(reader, true);
                        }

                        continue;
                }

                xmlReader.Read();
            }

            return errors;
        }
    }
}
