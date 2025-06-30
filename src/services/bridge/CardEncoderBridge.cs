using System;
using System.Runtime.InteropServices;

namespace CardEncoderBridge
{
    class Program
    {
        // Basic Communication
        [DllImport("CardEncoder.dll", CallingConvention = CallingConvention.Cdecl)]
        public static extern int CE_ConnectComm([MarshalAs(UnmanagedType.LPWStr)] string port);

        [DllImport("CardEncoder.dll", CallingConvention = CallingConvention.Cdecl)]
        public static extern int CE_ConnectCommOnPromise([MarshalAs(UnmanagedType.LPWStr)] string port, bool useReverseCardNo);

        [DllImport("CardEncoder.dll", CallingConvention = CallingConvention.Cdecl)]
        public static extern int CE_DisconnectComm();

        // Card Initialization and Handling
        [DllImport("CardEncoder.dll", CallingConvention = CallingConvention.Cdecl)]
        public static extern int CE_InitCardEncoder(string hotelInfo);

        [DllImport("CardEncoder.dll", CallingConvention = CallingConvention.Cdecl)]
        public static extern int CE_InitCard(string hotelInfo);

        [DllImport("CardEncoder.dll", CallingConvention = CallingConvention.Cdecl)]
        public static extern int CE_StopInitCard();

        [DllImport("CardEncoder.dll", CallingConvention = CallingConvention.Cdecl)]
        public static extern int CE_WriteCard(string hotelInfo, int buildNo, int floorNo, string mac, uint timestamp, bool allowLockOut);

        [DllImport("CardEncoder.dll", CallingConvention = CallingConvention.Cdecl)]
        public static extern int CE_ClearCard(string hotelInfo);

        [DllImport("CardEncoder.dll", CallingConvention = CallingConvention.Cdecl)]
        public static extern int CE_ReadCard(string hotelInfo, out IntPtr hotelArray);

        [DllImport("CardEncoder.dll", CallingConvention = CallingConvention.Cdecl)]
        public static extern int CE_GetCardNo(out IntPtr cardNumber);

        [DllImport("CardEncoder.dll", CallingConvention = CallingConvention.Cdecl)]
        public static extern IntPtr CE_GetCardID(); // returns JSON string

        // Utility
        [DllImport("CardEncoder.dll", CallingConvention = CallingConvention.Cdecl)]
        public static extern int CE_Beep(int voiceLen, int interval, int voiceCount);

        [DllImport("CardEncoder.dll", CallingConvention = CallingConvention.Cdecl)]
        public static extern int CE_GetVersion(out IntPtr versions);

        // Construction and De-initialization
        [DllImport("CardEncoder.dll", CallingConvention = CallingConvention.Cdecl)]
        public static extern int CE_InitConstructionCard();

        [DllImport("CardEncoder.dll", CallingConvention = CallingConvention.Cdecl)]
        public static extern int CE_DeInitCard(string hotelInfo);

        // Cancellation
        [DllImport("CardEncoder.dll", CallingConvention = CallingConvention.Cdecl)]
        public static extern int CE_CancelCard(string hotelInfo, string cardNumber, uint timestamp);

        [DllImport("CardEncoder.dll", CallingConvention = CallingConvention.Cdecl)]
        public static extern int CE_ReadCancellationInfo(string hotelInfo, out IntPtr infoArray);

        // Server Configuration
        [DllImport("CardEncoder.dll", CallingConvention = CallingConvention.Cdecl)]
        [return: MarshalAs(UnmanagedType.I1)]
        public static extern bool CE_ConfigServer(string url);

        [DllImport("CardEncoder.dll", CallingConvention = CallingConvention.Cdecl)]
        public static extern int CE_SetSectors(string sectors);

        [DllImport("CardEncoder.dll", CallingConvention = CallingConvention.Cdecl)]
        public static extern int CE_GetSectors(out IntPtr sectorStr);

        [DllImport("CardEncoder.dll", CallingConvention = CallingConvention.Cdecl)]
        public static extern int CE_GetCPUCardSupport();

        [DllImport("CardEncoder.dll", CallingConvention = CallingConvention.Cdecl)]
        public static extern int CE_ReadSectorRawData(int sectorNum, int blockNum, bool isEncrypted, byte[] IC_KEY, byte[] blockData);

        [DllImport("CardEncoder.dll", CallingConvention = CallingConvention.Cdecl)]
        public static extern int CE_WriteSectorRawData(int sectorNum, int blockNum, bool isEncrypted, byte[] IC_KEY, byte[] blockData);

        static void Main(string[] args)
        {
            if (args.Length == 0)
            {
                Console.WriteLine("Usage: CardEncoderBridge.exe <command> [params]");
                return;
            }

            string command = args[0].ToLower();

            try
            {
                switch (command)
                {
                    case "connect":
                        if (args.Length < 2)
                        {
                            Console.WriteLine("Error: Port required");
                            return;
                        }
                        int result = CE_ConnectComm(args[1]);
                        Console.WriteLine($"Connect result: {result}");
                        break;

                    case "disconnect":
                        int disconnectResult = CE_DisconnectComm();
                        Console.WriteLine($"Disconnect result: {disconnectResult}");
                        break;

                    case "getversion":
                        CE_GetVersion(out IntPtr versionPtr);
                        Console.WriteLine("Version: " + Marshal.PtrToStringAnsi(versionPtr));
                        break;

                    case "getcardno":
                        CE_GetCardNo(out IntPtr cardNo);
                        Console.WriteLine("Card No: " + Marshal.PtrToStringAnsi(cardNo));
                        break;

                    case "getcardid":
                        IntPtr cardId = CE_GetCardID();
                        Console.WriteLine("Card ID (JSON): " + Marshal.PtrToStringAnsi(cardId));
                        break;

                    case "writecard":
                        if (args.Length < 7)
                        {
                            Console.WriteLine("Error: writecard requires hotelInfo, buildNo, floorNo, mac, timestamp, allowLockOut");
                            return;
                        }
                        string hotelInfo = args[1];
                        int buildNo = int.Parse(args[2]);
                        int floorNo = int.Parse(args[3]);
                        string mac = args[4];
                        uint timestamp = uint.Parse(args[5]);
                        bool allowLockOut = bool.Parse(args[6]);
                        int writeResult = CE_WriteCard(hotelInfo, buildNo, floorNo, mac, timestamp, allowLockOut);
                        Console.WriteLine($"Write card result: {writeResult}");
                        break;

                    case "initcard":
                        if (args.Length < 2)
                        {
                            Console.WriteLine("Error: initcard requires hotelInfo");
                            return;
                        }
                        int initResult = CE_InitCard(args[1]);
                        Console.WriteLine($"Init card result: {initResult}");
                        break;

                    case "clearcard":
                        if (args.Length < 2)
                        {
                            Console.WriteLine("Error: clearcard requires hotelInfo");
                            return;
                        }
                        int clearResult = CE_ClearCard(args[1]);
                        Console.WriteLine($"Clear card result: {clearResult}");
                        break;

                    case "readcard":
                        if (args.Length < 2)
                        {
                            Console.WriteLine("Error: readcard requires hotelInfo");
                            return;
                        }
                        CE_ReadCard(args[1], out IntPtr hotelArray);
                        Console.WriteLine("Hotel Array: " + Marshal.PtrToStringAnsi(hotelArray));
                        break;

                    case "beep":
                        if (args.Length < 4)
                        {
                            Console.WriteLine("Error: beep requires voiceLen, interval, voiceCount");
                            return;
                        }
                        int voiceLen = int.Parse(args[1]);
                        int interval = int.Parse(args[2]);
                        int voiceCount = int.Parse(args[3]);
                        int beepResult = CE_Beep(voiceLen, interval, voiceCount);
                        Console.WriteLine($"Beep result: {beepResult}");
                        break;

                    case "configserver":
                        if (args.Length < 2)
                        {
                            Console.WriteLine("Error: configserver requires url");
                            return;
                        }
                        bool configResult = CE_ConfigServer(args[1]);
                        Console.WriteLine($"Config server result: {configResult}");
                        break;

                    case "setsectors":
                        if (args.Length < 2)
                        {
                            Console.WriteLine("Error: setsectors requires sectors");
                            return;
                        }
                        int sectorsResult = CE_SetSectors(args[1]);
                        Console.WriteLine($"Set sectors result: {sectorsResult}");
                        break;

                    case "getsectors":
                        CE_GetSectors(out IntPtr sectorStr);
                        Console.WriteLine("Sectors: " + Marshal.PtrToStringAnsi(sectorStr));
                        break;

                    case "initcardencoder":
                        if (args.Length < 2)
                        {
                            Console.WriteLine("Error: initcardencoder requires hotelInfo");
                            return;
                        }
                        int initEncoderResult = CE_InitCardEncoder(args[1]);
                        Console.WriteLine($"Init card encoder result: {initEncoderResult}");
                        break;

                    case "stopinitcard":
                        int stopInitResult = CE_StopInitCard();
                        Console.WriteLine($"Stop init card result: {stopInitResult}");
                        break;

                    case "deinitcard":
                        if (args.Length < 2)
                        {
                            Console.WriteLine("Error: deinitcard requires hotelInfo");
                            return;
                        }
                        int deinitResult = CE_DeInitCard(args[1]);
                        Console.WriteLine($"De-init card result: {deinitResult}");
                        break;

                    case "cancelcard":
                        if (args.Length < 4)
                        {
                            Console.WriteLine("Error: cancelcard requires hotelInfo, cardNumber, timestamp");
                            return;
                        }
                        string cancelHotelInfo = args[1];
                        string cardNumber = args[2];
                        uint cancelTimestamp = uint.Parse(args[3]);
                        int cancelResult = CE_CancelCard(cancelHotelInfo, cardNumber, cancelTimestamp);
                        Console.WriteLine($"Cancel card result: {cancelResult}");
                        break;

                    case "readcancellationinfo":
                        if (args.Length < 2)
                        {
                            Console.WriteLine("Error: readcancellationinfo requires hotelInfo");
                            return;
                        }
                        CE_ReadCancellationInfo(args[1], out IntPtr infoArray);
                        Console.WriteLine("Cancellation Info: " + Marshal.PtrToStringAnsi(infoArray));
                        break;

                    case "initconstructioncard":
                        int initConstructionResult = CE_InitConstructionCard();
                        Console.WriteLine($"Init construction card result: {initConstructionResult}");
                        break;

                    case "getcpucardsupport":
                        int cpuCardSupport = CE_GetCPUCardSupport();
                        Console.WriteLine($"CPU Card Support: {cpuCardSupport}");
                        break;

                    case "readsectorrawdata":
                        if (args.Length < 6)
                        {
                            Console.WriteLine("Error: readsectorrawdata requires sectorNum, blockNum, isEncrypted, IC_KEY, blockData");
                            return;
                        }
                        int sectorNum = int.Parse(args[1]);
                        int blockNum = int.Parse(args[2]);
                        bool isEncrypted = bool.Parse(args[3]);
                        string icKeyStr = args[4];
                        string blockDataStr = args[5];
                        
                        // Convert hex strings to byte arrays
                        byte[] IC_KEY = StringToByteArray(icKeyStr);
                        byte[] blockData = new byte[16]; // Assuming 16-byte block
                        
                        int readSectorResult = CE_ReadSectorRawData(sectorNum, blockNum, isEncrypted, IC_KEY, blockData);
                        Console.WriteLine($"Read sector raw data result: {readSectorResult}");
                        Console.WriteLine("Block Data: " + BitConverter.ToString(blockData));
                        break;

                    case "writesectorrawdata":
                        if (args.Length < 6)
                        {
                            Console.WriteLine("Error: writesectorrawdata requires sectorNum, blockNum, isEncrypted, IC_KEY, blockData");
                            return;
                        }
                        int writeSectorNum = int.Parse(args[1]);
                        int writeBlockNum = int.Parse(args[2]);
                        bool writeIsEncrypted = bool.Parse(args[3]);
                        string writeIcKeyStr = args[4];
                        string writeBlockDataStr = args[5];
                        
                        // Convert hex strings to byte arrays
                        byte[] writeIC_KEY = StringToByteArray(writeIcKeyStr);
                        byte[] writeBlockData = StringToByteArray(writeBlockDataStr);
                        
                        int writeSectorResult = CE_WriteSectorRawData(writeSectorNum, writeBlockNum, writeIsEncrypted, writeIC_KEY, writeBlockData);
                        Console.WriteLine($"Write sector raw data result: {writeSectorResult}");
                        break;

                    default:
                        Console.WriteLine($"Unknown command '{command}'");
                        break;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception: {ex.Message}");
            }
        }

        // Helper method to convert hex string to byte array
        private static byte[] StringToByteArray(string hex)
        {
            hex = hex.Replace(" ", "").Replace("-", "");
            int numberChars = hex.Length;
            byte[] bytes = new byte[numberChars / 2];
            for (int i = 0; i < numberChars; i += 2)
            {
                bytes[i / 2] = Convert.ToByte(hex.Substring(i, 2), 16);
            }
            return bytes;
        }
    }
}
